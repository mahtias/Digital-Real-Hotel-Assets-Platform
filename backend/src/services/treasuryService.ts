import prisma from "../config/database";

export const treasuryService = {

  // =========================================
  // 💰 RECORD PLATFORM REVENUE (10%)
  // =========================================
  async recordRevenue({
    hotelAssetId,
    amount,
    tx,
  }: {
    hotelAssetId: string;
    amount: number;
    tx?: any;
  }) {
    const client = tx || prisma;

    try {
      const record = await client.treasury.create({
        data: {
          hotelAssetId,
          amount,
          type: "BOOKING_REVENUE",
          status: "ACCRUED",
        },
      });

      console.log("🏦 Treasury recorded:", {
        hotelAssetId,
        amount,
      });

      return record;

    } catch (err) {
      console.error("Treasury error:", err);
      throw err;
    }
  },

  // =========================================
  // 📊 GET TOTAL TREASURY (ADMIN DASHBOARD)
  // =========================================
  async getTotalTreasury(hotelAssetId?: string) {
    const where = hotelAssetId ? { hotelAssetId } : {};

    const total = await prisma.treasury.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return total._sum.amount || 0;
  },

  // =========================================
  // 📦 GET TREASURY HISTORY
  // =========================================
  async getHistory(hotelAssetId: string) {
    return prisma.treasury.findMany({
      where: { hotelAssetId },
      orderBy: { createdAt: "desc" },
    });
  },
};