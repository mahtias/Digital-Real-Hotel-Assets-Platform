import { ethers } from "ethers";

const RPC_URL = process.env.BASE_SEPOLIA_RPC!;
export const provider = new ethers.JsonRpcProvider(RPC_URL);

export async function verifyTransaction(txHash: string) {
  const tx = await provider.getTransactionReceipt(txHash);

  if (!tx) {
    throw new Error("Transaction not found");
  }

  if (tx.status !== 1) {
    throw new Error("Transaction failed");
  }

  return tx;
}