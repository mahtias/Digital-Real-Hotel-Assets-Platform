import prisma from "../config/database";
import { Prisma } from "@prisma/client";
import { ethers } from "ethers";

// ========================================
// 🌐 WEB3 SETUP (BASE SEPOLIA)
// ========================================

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)"
];

const usdc = new ethers.Contract(
  process.env.USDC_ADDRESS!,
  USDC_ABI,
  signer
);

export const settlementService = {

  // ========================================
  // 🏨 STEP 1: CREATE SETTLEMENT (ON BOOKING)
  // ========================================
  async createSettlement(booking: any) {
    try {
      const hotelWallet = booking.hotelAsset.walletAddress;

      if (!hotelWallet) {
        throw new Error("Hotel wallet not found");
      }

      const amount =
        booking.totalPrice instanceof Prisma.Decimal
          ? booking.totalPrice.toNumber()
          : Number(booking.totalPrice);
          
      const settlement = await prisma.settlement.create({
        data: {
          hotelWallet,
          amount: new Prisma.Decimal(amount),
          currency: "USDC",
          status: "PENDING",

          booking: {
            connect: { id: booking.id },
          },
          hotelAsset: {
            connect: { id: booking.hotelAssetId },
          },
        },
      });

      console.log("🧾 Settlement created:", {
        bookingId: booking.id,
        amount,
        hotelWallet,
      });

      return settlement;

    } catch (err) {
      console.error(" Settlement creation error:", err);
      throw err;
    }
  },

  // ========================================
  // 💸 STEP 2: PROCESS HOTEL PAYOUT (REAL)
  // ========================================
  async processHotelPayout(hotelAssetId: string) {
    try {

      // 1️ Get all pending settlements
      const settlements = await prisma.settlement.findMany({
        where: {
          hotelAssetId,
          status: "PENDING",
        },
      });

      if (settlements.length === 0) {
        console.log("No pending settlements");
        return { message: "No pending settlements" };
      }

      // 2️ Calculate total payout
      const totalAmount = settlements.reduce((sum, s) => {
        return sum + Number(s.amount);
      }, 0);

      const hotelWallet = settlements[0].hotelWallet;

      console.log("💰 Processing REAL payout:", {
        hotelAssetId,
        totalAmount,
        hotelWallet,
      });

      // ========================================
      // 3️ REAL BLOCKCHAIN TRANSFER (BASE SEPOLIA)
      // ========================================

      const amountWei = ethers.parseUnits(totalAmount.toString(), 6);

      console.log("🔄 Sending USDC transfer...");

      const tx = await usdc.transfer(hotelWallet, amountWei);
      const receipt = await tx.wait();

      const realTxHash = receipt.hash;

      console.log("✅ Blockchain payout successful:", realTxHash);

      // ========================================
      // 4️ UPDATE DB
      // ========================================

      await prisma.settlement.updateMany({
        where: {
          hotelAssetId,
          status: "PENDING",
        },
        data: {
          status: "COMPLETED",
          txHash: realTxHash,
        },
      });

      console.log("✅ Payout completed:", {
        totalAmount,
        hotelWallet,
        txHash: realTxHash,
      });

      return {
        totalAmount,
        hotelWallet,
        txHash: realTxHash,
      };

    } catch (err) {
      console.error("❌ Payout processing error:", err);
      throw err;
    }
  },
};