"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.treasuryService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.treasuryService = {
    async recordRevenue({ hotelAssetId, amount, tx, }) {
        const client = tx || database_1.default;
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
        }
        catch (err) {
            console.error("Treasury error:", err);
            throw err;
        }
    },
    async getTotalTreasury(hotelAssetId) {
        const where = hotelAssetId ? { hotelAssetId } : {};
        const total = await database_1.default.treasury.aggregate({
            where,
            _sum: {
                amount: true,
            },
        });
        return total._sum.amount || 0;
    },
    async getHistory(hotelAssetId) {
        return database_1.default.treasury.findMany({
            where: { hotelAssetId },
            orderBy: { createdAt: "desc" },
        });
    },
};
//# sourceMappingURL=treasuryService.js.map