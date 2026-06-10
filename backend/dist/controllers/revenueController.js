"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelRevenue = void 0;
const database_1 = __importDefault(require("../config/database"));
const getHotelRevenue = async (req, res) => {
    try {
        const data = await database_1.default.booking.groupBy({
            by: ["hotelAssetId"],
            where: {
                status: "PAID",
            },
            _sum: {
                totalPrice: true,
                platformFee: true,
            },
        });
        const enriched = await Promise.all(data.map(async (item) => {
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: {
                    id: item.hotelAssetId,
                },
            });
            const pending = await database_1.default.settlement.aggregate({
                where: {
                    hotelAssetId: item.hotelAssetId,
                    status: "PENDING",
                },
                _sum: {
                    amount: true,
                },
            });
            const completed = await database_1.default.settlement.aggregate({
                where: {
                    hotelAssetId: item.hotelAssetId,
                    status: "COMPLETED",
                },
                _sum: {
                    amount: true,
                },
            });
            const totalRevenue = Number(item._sum.totalPrice || 0);
            const platformFees = Number(item._sum.platformFee || 0);
            const investorYield = totalRevenue * 0.10;
            const hotelNetRevenue = totalRevenue -
                platformFees -
                investorYield;
            return {
                hotelId: item.hotelAssetId,
                hotelName: hotel?.name || "Unknown Hotel",
                totalRevenue,
                platformFees,
                platformFeeRate: 0.05,
                investorYield,
                investorYieldRate: 0.10,
                hotelNetRevenue,
                pending: Number(pending._sum.amount || 0),
                paid: Number(completed._sum.amount || 0),
            };
        }));
        return res.json(enriched);
    }
    catch (err) {
        console.error("Revenue Error:", err);
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.getHotelRevenue = getHotelRevenue;
//# sourceMappingURL=revenueController.js.map