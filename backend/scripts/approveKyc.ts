import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC = process.env.BASE_SEPOLIA_RPC!;
const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY!;
const KYC_CONTRACT = process.env.KYC_CONTRACT_ADDRESS!;

const ABI = [
  "function approveKYC(address user,uint8 level,uint256 validity)"
];

async function approve() {

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

  console.log("Admin wallet:", wallet.address);

  const contract = new ethers.Contract(KYC_CONTRACT, ABI, wallet);

  const user = "0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f";

  // Level 1 KYC
  const level = 1;

  // 1 year validity
  const validity = 365 * 24 * 60 * 60;

  const tx = await contract.approveKYC(user, level, validity);

  console.log("TX sent:", tx.hash);

  await tx.wait();

  console.log(" KYC approved on blockchain");
}

approve();