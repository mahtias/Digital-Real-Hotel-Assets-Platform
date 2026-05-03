import prisma from "../config/database";

export const yieldService = {
  async distributeFromBooking(bookingId: string, amount: number) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) throw new Error("Booking not found");

      // 10% yield
      const totalYield = amount * 0.10;

      //  Create distribution record
      const distribution = await tx.yield_distributions.create({
        data: {
          booking_id: booking.id,
          hotel_asset_id: booking.hotelAssetId,
          total_amount: totalYield,
        },
      });

      //  Fetch investors
      const investments = await tx.investment.findMany({
        where: {
          hotelAssetId: booking.hotelAssetId,
          status: "ACTIVE",
        },
      });

      if (investments.length === 0) return;

      const totalInvested = investments.reduce(
        (sum, inv) => sum + Number(inv.investedAmount),
        0
      );

      for (const inv of investments) {
        if (totalInvested === 0) continue;

        const share = Number(inv.investedAmount) / totalInvested;
        const userYield = Number((totalYield * share).toFixed(8));

        // ✅ Ledger record
        await tx.investor_yields.create({
          data: {
            yield_distribution_id: distribution.id,
            user_id: inv.userId,
            investment_id: inv.id,
            amount: userYield,
            status: "PENDING",
          },
        });

        // ✅ Fast balance (your existing system)
        await tx.investment.update({
          where: { id: inv.id },
          data: {
            pendingRewards: {
              increment: userYield,
            },
          },
        });
      }
    });
  },
};