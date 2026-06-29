import prisma from "../config/database";
import { Prisma } from "@prisma/client";
import hotelYieldVaultService from "./HotelYieldVaultService";
import { STABLECOIN_REGISTRY } from "../config/stablecoinRegistry";

export const yieldService = {

  // =========================================
  //  DISTRIBUTE INVESTOR YIELD
  // =========================================
 async distributeFromBooking(
  bookingId: string,
  investorPoolAmount: number,
  stablecoinSymbol: string = "USDC",
  tx?: any
) {
  const client = tx || prisma;

  const result = await client.$transaction(
    async (db: any) => {

      const batchDistributionIds: string[] = [];
      const batchInvestors: `0x${string}`[] = [];
      const batchAmounts: bigint[] = [];
      const yieldRowsToUpdate: string[] = [];

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
      // 2. PREVENT DUPLICATE DISTRIBUTION
      // =====================================

      const existingDistribution =
        await db.yield_distributions.findFirst({
          where: {
            booking_id: booking.id,
          },
        });

      if (existingDistribution) {
        throw new Error(
          `Yield already distributed for booking ${booking.id}`
        );
      }

      // =====================================
      // 3. CREATE DISTRIBUTION
      // =====================================

      const distribution =
        await db.yield_distributions.create({
          data: {
            booking_id: booking.id,
            hotel_asset_id: booking.hotelAssetId,
            total_amount: investorPoolAmount,
            status: "PENDING",
            stablecoin_symbol: stablecoinSymbol,
          },
        });

      // =====================================
      // 4. LOAD INVESTORS (snapshot-first)
      // =====================================

      // Use latest active snapshot if available — ensures yield is distributed
      // based on who held tokens at snapshot time, not at booking-paid time.
      const activeSnapshot = await prisma.snapshot.findFirst({
        where: { hotelAssetId: booking.hotelAssetId, status: "ACTIVE" },
        orderBy: { takenAt: "desc" },
        include: { entries: true },
      });

      let investments: any[];

      if (activeSnapshot && activeSnapshot.entries.length > 0) {
        const snapshotInvestmentIds = activeSnapshot.entries.map((e: any) => e.investmentId);

        investments = await db.investment.findMany({
          where: { id: { in: snapshotInvestmentIds } },
          include: { user: true },
        });

        console.log(
          `Using snapshot ${activeSnapshot.id} (taken ${activeSnapshot.takenAt.toISOString()}) — ${investments.length} investor(s)`
        );
      } else {
        investments = await db.investment.findMany({
          where: { hotelAssetId: booking.hotelAssetId, status: "CONFIRMED" },
          include: { user: true },
        });

        console.log(
          `No snapshot found — using ${investments.length} live CONFIRMED investor(s)`
        );
      }

      if (investments.length === 0) {
        return {
          distribution,
          distributed: false,
        };
      }

      // =====================================
      // 5. CALCULATE TOTAL INVESTED
      // =====================================

      const totalInvested =
        investments.reduce(
          (sum: number, inv: any) =>
            sum + Number(inv.investedAmount),
          0
        );

      if (totalInvested <= 0) {
        throw new Error(
          "Total invested amount is zero"
        );
      }

      // =====================================
      // 6. PREPARE DISTRIBUTION DATA
      // =====================================

      for (const inv of investments) {

        if (!inv.user.walletAddress) {

          console.warn(
            `Investor ${inv.userId} has no wallet`
          );

          continue;
        }

        const investorShare =
          Number(inv.investedAmount) /
          totalInvested;

        const investorYield = Number(
          (
            investorPoolAmount *
            investorShare
          ).toFixed(8)
        );

        const yieldRow =
          await db.investor_yields.create({
            data: {
              yield_distribution_id:
                distribution.id,
              user_id: inv.userId,
              investment_id: inv.id,
              amount: investorYield,
              status: "PENDING",
              wallet_address:
                inv.user.walletAddress,
              stablecoin_symbol: stablecoinSymbol,
            },
          });

        batchDistributionIds.push(
          yieldRow.id
        );

        batchInvestors.push(
          inv.user.walletAddress as `0x${string}`
        );

        batchAmounts.push(
          BigInt(
            Math.round(
              investorYield *
                (10 ** (STABLECOIN_REGISTRY[stablecoinSymbol]?.decimals ?? 6))
            )
          )
        );

        yieldRowsToUpdate.push(
          yieldRow.id
        );

        // Dashboard cache only

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
      }

      return {
        distribution,
        distributed: true,
        totalInvested,
        investors: investments.length,

        batchDistributionIds,
        batchInvestors,
        batchAmounts,
        yieldRowsToUpdate,
      };
    }
  );

  // =====================================
  // 7. NOTHING TO ALLOCATE
  // =====================================

  if (
    !result.distributed ||
    result.batchDistributionIds.length === 0
  ) {
    return result;
  }

  // =====================================
// 8. ALLOCATE ON CHAIN
// =====================================

try {

  const txResult =
    await hotelYieldVaultService.addClaimableBatch(
      result.batchDistributionIds,
      result.batchInvestors,
      result.batchAmounts
    );

  if (
    txResult.receipt.status !== "success"
  ) {
    throw new Error(
      "Vault batch allocation failed"
    );
  }

  // =====================================
  // 9. MARK INVESTOR YIELDS ALLOCATED
  // =====================================

  await prisma.investor_yields.updateMany({
    where: {
      id: {
        in: result.yieldRowsToUpdate,
      },
    },
    data: {
      status: "ALLOCATED",
      tx_hash: txResult.hash,
    },
  });

  // =====================================
  // 10. MARK DISTRIBUTION ALLOCATED
  // =====================================

  await prisma.yield_distributions.update({
    where: {
      id: result.distribution.id,
    },
    data: {
      status: "ALLOCATED",
      tx_hash: txResult.hash,
    },
  });

  console.log(
    ` Yield allocated for booking ${bookingId}`
  );

  return {
    ...result,
    txHash: txResult.hash,
  };

} catch (error) {

  console.error(
    " Yield allocation failed:",
    error
  );

  await prisma.yield_distributions.update({
    where: {
      id: result.distribution.id,
    },
    data: {
      status: "FAILED",
    },
  });

  await prisma.investor_yields.updateMany({
    where: {
      id: {
        in: result.yieldRowsToUpdate,
      },
    },
    data: {
      status: "FAILED",
      failure_reason:
        error instanceof Error
          ? error.message
          : "Allocation failed",
    },
  });

  throw error;
}
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

      const investorPool = paymentAmount * 0.10; 
      await this.distributeFromBooking(booking.id, investorPool);
      console.log(` Yield distributed for booking ${booking.id}`);
    } catch (err) {
      console.error(` Yield distribution failed for booking ${booking.id}:`, err);
    }
  }

  console.log("🔄 Pending yield distribution completed.");
}
};

