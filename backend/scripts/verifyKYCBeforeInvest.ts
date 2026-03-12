// scripts/verifyKYCBeforeInvest.ts
import prisma from "../src/config/database";
import { web3Service } from '../src/services/web3Service';

async function verifyKYCForWallet(walletAddress: string) {
  try {
    if (!walletAddress) throw new Error("Wallet address is required");

    // Fetch KYC record for this wallet
    const kycRecord = await prisma.kyc.findFirst({
      where: {
        user: { walletAddress },
        // Check backend status and/or approvedAt date
        OR: [
          { status: 'APPROVED' },
          { approvedAt: { not: null } },
        ],
      },
      include: { user: true },
    });

    if (!kycRecord) {
      console.log(`No approved backend KYC found for wallet ${walletAddress}`);
      return;
    }

    console.log(`Found KYC for user ${kycRecord.user.email}`);
    console.log(`Document hash: ${kycRecord.documentHash}`);

    if (!kycRecord.documentHash) {
      console.error('Cannot register KYC: document hash missing');
      return;
    }

    // Check blockchain status
    const isVerified = await web3Service.isKycVerified(walletAddress);
    console.log(`Blockchain verified: ${isVerified}`);

    if (isVerified) {
      console.log("✅ Already verified on blockchain, updating DB if needed...");

      await prisma.kyc.update({
        where: { id: kycRecord.id },
        data: {
          blockchainTx: kycRecord.blockchainTx ?? null,
        },
      });

      console.log("💾 Database updated with existing blockchain info");
      return;
    }

    // Register KYC on blockchain with retries
    console.log("⏳ Syncing KYC to blockchain...");

    const txHash = await web3Service.registerKycWithRetry(
      walletAddress,
      kycRecord.documentHash,
      3
    );

    console.log(`✅ Blockchain KYC synced successfully! TxHash: ${txHash}`);

    // Update DB with blockchain transaction hash
    await prisma.kyc.update({
      where: { id: kycRecord.id },
      data: {
        blockchainTx: txHash,
      },
    });

    console.log("💾 Database updated with blockchain transaction hash");

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error verifying KYC:", error.message);
    } else {
      console.error("❌ Unknown error verifying KYC:", error);
    }
  } finally {
    process.exit(0);
  }
}

// Example usage: pass wallet address from your frontend log
const walletAddress = "0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f";
verifyKYCForWallet(walletAddress);