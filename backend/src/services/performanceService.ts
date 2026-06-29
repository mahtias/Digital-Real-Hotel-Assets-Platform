import prisma from "../config/database";
import { qloService } from "./qloService";

export const performanceService = {

  // =========================================
  //  RECORD MONTHLY PERFORMANCE FOR A HOTEL
  // =========================================
  async recordPerformance(
    hotelAssetId: string,
    adminId: string,
    period?: string // "YYYY-MM", defaults to last month
  ) {
    const targetPeriod = period ?? getPreviousMonth();
    const { periodStart, periodEnd } = getPeriodDates(targetPeriod);

    const hotel = await prisma.hotelAsset.findUnique({
      where: { id: hotelAssetId },
    });

    if (!hotel) throw new Error("Hotel not found");

    // =========================================
    // 1. PLATFORM BOOKINGS DATA
    // =========================================
    const bookingStats = await prisma.booking.aggregate({
      where: {
        hotelAssetId,
        status: "PAID",
        checkInDate: { gte: periodStart },
        checkOutDate: { lte: periodEnd },
      },
      _sum: { totalPrice: true, platformFee: true },
      _count: { id: true },
    });

    const platformRevenue = Number(bookingStats._sum.totalPrice ?? 0);
    const bookingCount    = bookingStats._count.id;

    // =========================================
    // 2. QLOAPP DATA (optional — falls back to 0)
    // =========================================
    let qloRevenue = 0;
    if (hotel.qloHotelId) {
      try {
        const qloStats = await qloService.getHotelStats(
          hotel.qloHotelId,
          periodStart.toISOString().split("T")[0],
          periodEnd.toISOString().split("T")[0]
        );
        qloRevenue = qloStats.totalRevenue;
      } catch {
        console.warn(`QloApps stats unavailable for hotel ${hotel.name} — using platform data only`);
      }
    }

    const totalRevenue   = platformRevenue > 0 ? platformRevenue : qloRevenue;
    const investorYield  = totalRevenue * 0.20;

    // =========================================
    // 3. OCCUPANCY + REVPAR
    // =========================================
    const roomCount     = hotel.roomCount ?? 1;
    const daysInPeriod  = Math.round(
      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const availableRooms = roomCount * daysInPeriod;
    const occupancyRate  = availableRooms > 0
      ? Math.min((bookingCount / availableRooms) * 100, 100)
      : 0;
    const revpar = availableRooms > 0
      ? totalRevenue / availableRooms
      : 0;

    // =========================================
    // 4. UPSERT (allow re-recording same period)
    // =========================================
    const record = await prisma.hotelPerformance.upsert({
      where: { hotelAssetId_period: { hotelAssetId, period: targetPeriod } },
      create: {
        hotelAssetId,
        period: targetPeriod,
        periodStart,
        periodEnd,
        totalRevenue,
        qloRevenue,
        bookingCount,
        occupancyRate: Number(occupancyRate.toFixed(2)),
        revpar: Number(revpar.toFixed(2)),
        investorYield,
        recordedBy: adminId,
      },
      update: {
        totalRevenue,
        qloRevenue,
        bookingCount,
        occupancyRate: Number(occupancyRate.toFixed(2)),
        revpar: Number(revpar.toFixed(2)),
        investorYield,
        recordedBy: adminId,
        recordedAt: new Date(),
      },
    });

    // Also update the live occupancyRate + revpar on HotelAsset for quick reads
    await prisma.hotelAsset.update({
      where: { id: hotelAssetId },
      data: {
        occupancyRate: Number(occupancyRate.toFixed(2)),
        revpar: Math.round(revpar),
      },
    });

    return record;
  },

  // =========================================
  //  GET PERFORMANCE HISTORY FOR A HOTEL
  // =========================================
  async getPerformanceHistory(hotelAssetId: string, limit = 12) {
    return prisma.hotelPerformance.findMany({
      where: { hotelAssetId },
      orderBy: { period: "desc" },
      take: limit,
    });
  },

  // =========================================
  //  GET LATEST RECORD FOR A HOTEL
  // =========================================
  async getLatestPerformance(hotelAssetId: string) {
    return prisma.hotelPerformance.findFirst({
      where: { hotelAssetId },
      orderBy: { period: "desc" },
    });
  },

  // =========================================
  //  GET PERFORMANCE ACROSS ALL HOTELS
  // =========================================
  async getAllHotelsPerformance(period?: string) {
    const targetPeriod = period ?? getPreviousMonth();
    return prisma.hotelPerformance.findMany({
      where: { period: targetPeriod },
      include: { hotelAsset: { select: { name: true, location: true } } },
      orderBy: { totalRevenue: "desc" },
    });
  },
};

// =========================================
//  HELPERS
// =========================================
function getPreviousMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getPeriodDates(period: string): { periodStart: Date; periodEnd: Date } {
  const [year, month] = period.split("-").map(Number);
  const periodStart = new Date(year, month - 1, 1);
  const periodEnd   = new Date(year, month, 0, 23, 59, 59); // last day of month
  return { periodStart, periodEnd };
}
