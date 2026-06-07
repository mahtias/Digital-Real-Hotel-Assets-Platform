import prisma from "../config/database";
import { yieldService } from "./yieldService";
import { settlementService } from "./settlementService";
import { treasuryService } from "./treasuryService";

export const revenueService = {

  async processBookingRevenue({
    booking,
    paymentAmount,
    tx,
  }: {
    booking: any;
    paymentAmount: number;
    tx: any;
  }) {

    // =====================================
    // 1. SPLIT REVENUE
    // =====================================

    const hotelShare = paymentAmount * 0.70;
    const investorPool = paymentAmount * 0.20;
    const platformFee = paymentAmount * 0.10;

    console.log("💰 Revenue Split:", {
      hotelShare,
      investorPool,
      platformFee,
    });

    // =====================================
    // 2. TREASURY (10%)
    // =====================================

    await treasuryService.recordRevenue({
      hotelAssetId: booking.hotelAssetId,
      amount: platformFee,
      tx,
    });

    // =====================================
    // 3. YIELD DISTRIBUTION (20%)
    // =====================================

    await yieldService.distributeFromBooking(
      booking.id,
      investorPool
    );

    // =====================================
    // 4. SETTLEMENT (70% HOTEL)
    // =====================================

    await settlementService.createSettlement({
      booking,
      amount: hotelShare,
      tx,
    });

    return {
      hotelShare,
      investorPool,
      platformFee,
    };
  },
};