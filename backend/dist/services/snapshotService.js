"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.snapshotService = {
    async takeSnapshot(adminId, hotelAssetId) {
        const where = { status: "CONFIRMED" };
        if (hotelAssetId)
            where.hotelAssetId = hotelAssetId;
        const investments = await database_1.default.investment.findMany({
            where,
            include: { user: true },
        });
        if (investments.length === 0) {
            throw new Error(hotelAssetId
                ? `No confirmed investments found for hotel ${hotelAssetId}`
                : "No confirmed investments found");
        }
        const snapshot = await database_1.default.snapshot.create({
            data: {
                takenBy: adminId,
                hotelAssetId: hotelAssetId ?? null,
                status: "ACTIVE",
                totalEntries: investments.length,
                entries: {
                    create: investments.map((inv) => ({
                        userId: inv.userId,
                        investmentId: inv.id,
                        walletAddress: inv.walletAddress ?? inv.user.walletAddress ?? "",
                        tokenAmount: inv.tokenAmount,
                        hotelAssetId: inv.hotelAssetId,
                    })),
                },
            },
            include: { entries: true },
        });
        await database_1.default.snapshot.updateMany({
            where: {
                id: { not: snapshot.id },
                hotelAssetId: hotelAssetId ?? null,
                status: "ACTIVE",
            },
            data: { status: "SUPERSEDED" },
        });
        return snapshot;
    },
    async getLatestSnapshot(hotelAssetId) {
        return database_1.default.snapshot.findFirst({
            where: { hotelAssetId, status: "ACTIVE" },
            orderBy: { takenAt: "desc" },
            include: { entries: true },
        });
    },
    async listSnapshots(hotelAssetId) {
        const where = {};
        if (hotelAssetId)
            where.hotelAssetId = hotelAssetId;
        return database_1.default.snapshot.findMany({
            where,
            orderBy: { takenAt: "desc" },
            include: {
                _count: { select: { entries: true } },
                hotelAsset: { select: { name: true } },
                takenByUser: { select: { firstName: true, lastName: true, email: true } },
            },
        });
    },
    async getSnapshotById(snapshotId) {
        return database_1.default.snapshot.findUnique({
            where: { id: snapshotId },
            include: {
                entries: true,
                hotelAsset: { select: { name: true } },
                takenByUser: { select: { firstName: true, lastName: true, email: true } },
            },
        });
    },
};
//# sourceMappingURL=snapshotService.js.map