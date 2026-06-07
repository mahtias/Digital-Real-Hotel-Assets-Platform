import prisma from "../config/database";
import { Prisma } from "@prisma/client";
export const yieldService = {

  // =========================================
  // 💰 DISTRIBUTE INVESTOR YIELD
  // =========================================
  async distributeFromBooking(
    bookingId: string,
    investorPoolAmount: number,
    tx?: any
  ) {

    const client = tx || prisma;

    return client.$transaction(async (db: any) => {

      // =====================================
      // 1. GET BOOKING
      // =====================================

      const booking = await db.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      // =====================================
      // 2. CREATE YIELD DISTRIBUTION
      // =====================================

      const distribution =
        await db.yield_distributions.create({
          data: {
            booking_id: booking.id,
            hotel_asset_id: booking.hotelAssetId,
            total_amount: investorPoolAmount,
          },
        });

      console.log("💰 Yield distribution created:", {
        bookingId,
        investorPoolAmount,
      });

      // =====================================
      // 3. FETCH ACTIVE INVESTORS
      // =====================================

      const investments = await db.investment.findMany({
        where: {
          hotelAssetId: booking.hotelAssetId,
          status: "ACTIVE",
        },
      });

      // No investors
      if (investments.length === 0) {

        console.log("⚠️ No active investors");

        return {
          distribution,
          distributed: false,
        };
      }

      // =====================================
      // 4. CALCULATE TOTAL INVESTED
      // =====================================

      const totalInvested = investments.reduce(
        (
          sum: number,
          inv: any
        ) => {
          return sum + Number(inv.investedAmount);
        },
        0
      );

      if (totalInvested <= 0) {
        throw new Error("Total invested amount is zero");
      }

      // =====================================
      // 5. DISTRIBUTE TO EACH INVESTOR
      // =====================================

      for (const inv of investments) {

        const investorShare =
          Number(inv.investedAmount) / totalInvested;

        const investorYield = Number(
          (investorPoolAmount * investorShare).toFixed(8)
        );

        // =================================
        // CREATE LEDGER ENTRY
        // =================================

        await db.investor_yields.create({
          data: {
            yield_distribution_id: distribution.id,
            user_id: inv.userId,
            investment_id: inv.id,
            amount: investorYield,
            status: "PENDING",
          },
        });

        // =================================
        // UPDATE FAST REWARD BALANCE
        // =================================

        await db.investment.update({
          where: {
            id: inv.id,
          },
          data: {
            pendingRewards: {
              increment: investorYield,
            },
          },
        });

        console.log("✅ Investor yield distributed:", {
          investorId: inv.userId,
          investorYield,
        });
      }

      // =====================================
      // 6. COMPLETE
      // =====================================

      return {
        distribution,
        distributed: true,
        totalInvested,
        investors: investments.length,
      };
    });
  },

  // --------------------------------------------------
// 🔁 BATCH: DISTRIBUTE ALL PENDING YIELDS
// --------------------------------------------------
async distributePendingYields() {
  console.log("🔄 Distributing all pending yields...");

  // Fetch bookings that are PAID but have pending yield
  const bookings = await prisma.booking.findMany({
    where: {
      status: "PAID",
    },
  });

  for (const booking of bookings) {
    try {
      const paymentAmount =
        booking.totalPrice instanceof Prisma.Decimal
          ? booking.totalPrice.toNumber()
          : Number(booking.totalPrice);

      const investorPool = paymentAmount * 0.10; // 10% yield pool
      await this.distributeFromBooking(booking.id, investorPool);
      console.log(`✅ Yield distributed for booking ${booking.id}`);
    } catch (err) {
      console.error(`❌ Yield distribution failed for booking ${booking.id}:`, err);
    }
  }

  console.log("🔄 Pending yield distribution completed.");
}
};

