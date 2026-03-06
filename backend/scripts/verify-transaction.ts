// scripts/verify-transaction.ts

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function verifyTransaction() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const txHash = "0xde189ffa5194ee826e51860ecd1cf0b1370ce83a4bd7fa6ff2363e4a20a8a530";
  const targetAddress = "0x09b5657527A5247807ff357814440355f485854A";

  console.log("🔍 Verifying Transaction\n");
  console.log("Transaction Hash:", txHash);
  console.log("\n" + "═".repeat(60) + "\n");

  try {
    // Get transaction details
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      console.log("❌ Transaction not found!");
      return;
    }

    console.log("📤 Transaction Details:\n");
    console.log("   From:", tx.from);
    console.log("   To:", tx.to);
    console.log("   Value:", ethers.formatEther(tx.value), "ETH");
    console.log("   Block:", tx.blockNumber);
    console.log();

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (receipt) {
      console.log("📋 Receipt:\n");
      console.log("   Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
      console.log("   Block:", receipt.blockNumber);
      console.log("   Gas Used:", receipt.gasUsed.toString());
      console.log();
    }

    // Check current balance (with a small delay)
    console.log("⏳ Checking current balance...\n");
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const balance = await provider.getBalance(targetAddress);
    console.log("💰 Target Wallet Balance:", ethers.formatEther(balance), "ETH");
    console.log();

    if (balance > 0n) {
      console.log("✅ Funding successful!");
      console.log("\nNext step:");
      console.log("   npx tsx scripts/submit-and-approve-target.ts");
    } else {
      console.log("❌ Balance still zero - checking what went wrong...");
      
      // Check if transaction actually succeeded
      if (receipt?.status === 0) {
        console.log("\n⚠️  Transaction failed on-chain!");
      } else if (tx.to?.toLowerCase() !== targetAddress.toLowerCase()) {
        console.log("\n⚠️  Transaction sent to wrong address!");
        console.log("   Expected:", targetAddress);
        console.log("   Actual:", tx.to);
      }
    }

    console.log("\n" + "═".repeat(60) + "\n");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

verifyTransaction();
