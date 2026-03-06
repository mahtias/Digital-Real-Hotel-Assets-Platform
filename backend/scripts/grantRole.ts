import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contract = new ethers.Contract(
  process.env.KYC_CONTRACT_ADDRESS!,
  require("../src/blockchain/abis/KYCRegistry.json"),
  adminWallet
);

async function main() {
  const role = await contract.VERIFIER_ROLE();

  const tx = await contract.grantRole(
    role,
    process.env.TREASURY_ADDRESS
  );

  await tx.wait();
  console.log("✅ VERIFIER_ROLE granted");
}

main();
