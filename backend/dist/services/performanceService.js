"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const qloService_1 = require("./qloService");
exports.performanceService = {
    async recordPerformance(hotelAssetId, adminId, period) {
        const targetPeriod = period ?? getCurrentMonth();
        const { periodStart, periodEnd } = getPeriodDates(targetPeriod);
        const hotel = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelAssetId },
        });
        if (!hotel)
            throw new Error("Hotel not found");
        const bookingStats = await database_1.default.booking.aggregate({
            where: {
                hotelAssetId,
                status: "PAID",
                checkInDate: { gte: periodStart, lte: periodEnd },
            },
            _sum: { totalPrice: true, platformFee: true },
            _count: { id: true },
        });
        const platformRevenue = Number(bookingStats._sum.totalPrice ?? 0);
        const bookingCount = bookingStats._count.id;
        let qloRevenue = 0;
        if (hotel.qloHotelId) {
            try {
                const qloStats = await qloService_1.qloService.getHotelStats(hotel.qloHotelId, periodStart.toISOString().split("T")[0], periodEnd.toISOString().split("T")[0]);
                qloRevenue = qloStats.totalRevenue;
            }
            catch {
                console.warn(`QloApps stats unavailable for hotel ${hotel.name} — using platform data only`);
            }
        }
        const totalRevenue = platformRevenue > 0 ? platformRevenue : qloRevenue;
        const investorYield = totalRevenue * 0.20;
        const roomCount = hotel.roomCount ?? 1;
        const daysInPeriod = Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
        const availableRooms = roomCount * daysInPeriod;
        const occupancyRate = availableRooms > 0
            ? Math.min((bookingCount / availableRooms) * 100, 100)
            : 0;
        const revpar = availableRooms > 0
            ? totalRevenue / availableRooms
            : 0;
        const record = await database_1.default.hotelPerformance.upsert({
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
        await database_1.default.hotelAsset.update({
            where: { id: hotelAssetId },
            data: {
                occupancyRate: Number(occupancyRate.toFixed(2)),
                revpar: Math.round(revpar),
            },
        });
        return record;
    },
    async getPerformanceHistory(hotelAssetId, limit = 12) {
        return database_1.default.hotelPerformance.findMany({
            where: { hotelAssetId },
            orderBy: { period: "desc" },
            take: limit,
        });
    },
    async getLatestPerformance(hotelAssetId) {
        return database_1.default.hotelPerformance.findFirst({
            where: { hotelAssetId },
            orderBy: { period: "desc" },
        });
    },
    async getAllHotelsPerformance(period) {
        const targetPeriod = period ?? getCurrentMonth();
        return database_1.default.hotelPerformance.findMany({
            where: { period: targetPeriod },
            include: { hotelAsset: { select: { name: true, location: true } } },
            orderBy: { totalRevenue: "desc" },
        });
    },
};
function getCurrentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function getPeriodDates(period) {
    const [year, month] = period.split("-").map(Number);
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0, 23, 59, 59);
    return { periodStart, periodEnd };
}
//# sourceMappingURL=performanceService.js.map