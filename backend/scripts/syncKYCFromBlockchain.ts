// scripts/syncKYCFromBlockchain.ts
import prisma from "../src/config/database";
import { ethers } from "ethers";
import kycRegistryAbi from "../../out/KYCRegistry.sol/KYCRegistry.json";

//const prisma = new PrismaClient();

const RPC_URL = process.env.RPC_URL || "https://base-sepolia.g.alchemy.com/v2/w4sdyVuAlr44h9jRAE08y";
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const KYC_ADDRESS = process.env.KYC_CONTRACT_ADDRESS!;

// Setup provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Setup contract
const kycContract = new ethers.Contract(KYC_ADDRESS, kycRegistryAbi.abi, signer);

// Gas limit for KYC registration
const GAS_LIMITS = { KYC_REGISTER: 100_000 };

// Max retries for failed transactions
const MAX_RETRIES = 3;

async function syncKYC() {
  console.log("⏳ Starting KYC sync...");

  // Fetch users whose DB is approved but not yet synced
  const users = await prisma.user.findMany({
    where: {
      kycApprovedAt: { not: null }, // fetch approved users
      kycBlockchainSynced: false
    }
  });

  console.log(`Found ${users.length} users to sync.`);

  for (const user of users) {
    const address = user.walletAddress;

    if (!address) {
      console.warn(`⚠️ Skipping user ${user.id} because walletAddress is missing`);
      continue;
    }

    console.log(`\n🔹 Checking KYC for ${address}`);

    try {
      const onChainStatus: number = await kycContract.getKYCStatus(address);

      if (onChainStatus !== 0) {
        console.log("✅ KYC already exists on-chain. Updating DB...");
        await prisma.user.update({
          where: { walletAddress: address },
          data: {
            kycBlockchainSynced: true,
            kycSyncAttempts: 0,
            kycSyncError: null
          }
        });
        continue;
      }

      // Approve KYC on-chain with retry
      const level = 1; // BASIC
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      let lastError: any = null;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`Attempt ${attempt}/${MAX_RETRIES} to register KYC for ${address}...`);
          const tx = await kycContract.approveKYC(address, level, expiresAt, {
            gasLimit: GAS_LIMITS.KYC_REGISTER
          });

          console.log("Tx sent:", tx.hash);
          const receipt = await tx.wait();
          console.log("✅ KYC approved on-chain:", receipt.hash);

          await prisma.user.update({
            where: { walletAddress: address },
            data: {
              kycBlockchainSynced: true,
              kycBlockchainTxHash: receipt.hash,
              kycLastVerified: new Date(),
              kycSyncAttempts: 0,
              kycSyncError: null
            }
          });

          lastError = null;
          break; // success, break retry loop
        } catch (err: any) {
          lastError = err;
          console.error(`❌ KYC registration attempt ${attempt} failed:`, err.message);
          // exponential backoff
          await new Promise(res => setTimeout(res, attempt * 5000));
        }
      }

      if (lastError) {
        await prisma.user.update({
          where: { walletAddress: address },
          data: {
            kycSyncAttempts: { increment: 1 },
            kycSyncError: lastError.message
          }
        });
        console.error(`❌ Failed to sync KYC for ${address} after ${MAX_RETRIES} attempts`);
      }

    } catch (error: any) {
      console.error("❌ Failed to check/sync KYC:", error.message);
      await prisma.user.update({
        where: { walletAddress: address },
        data: {
          kycSyncAttempts: { increment: 1 },
          kycSyncError: error.message
        }
      });
    }
  }

  console.log("\n✅ KYC sync finished.");
  await prisma.$disconnect();
}

// Run the script
syncKYC().catch((err) => {
  console.error("Fatal error in KYC sync:", err);
  prisma.$disconnect();
});