"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettlementHistory = exports.processSettlement = void 0;
const database_1 = __importDefault(require("../config/database"));
const settlementService_1 = require("../services/settlementService");
const processSettlement = async (req, res) => {
    try {
        const { hotelAssetId } = req.params;
        const result = await settlementService_1.settlementService.processHotelPayout(hotelAssetId);
        return res.json({
            success: true,
            message: "Settlement processed",
            data: result,
        });
    }
    catch (err) {
        console.error("Settlement Error:", err);
        return res.status(500).json({
            success: false,
            message: "Settlement failed",
            error: err.message,
        });
    }
};
exports.processSettlement = processSettlement;
const getSettlementHistory = async (req, res) => {
    try {
        const settlements = await database_1.default.settlement.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        const formatted = await Promise.all(settlements.map(async (s) => {
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: {
                    id: s.hotelAssetId,
                },
                select: {
                    name: true,
                    location: true,
                },
            });
            const booking = await database_1.default.booking.findUnique({
                where: {
                    id: s.bookingId,
                },
                select: {
                    bookingCode: true,
                },
            });
            return {
                id: s.id,
                bookingCode: booking?.bookingCode,
                hotelName: hotel?.name,
                location: hotel?.location,
                amount: Number(s.amount),
                currency: s.currency,
                status: s.status,
                txHash: s.txHash,
                hotelWallet: s.hotelWallet,
                createdAt: s.createdAt,
            };
        }));
        return res.json(formatted);
    }
    catch (err) {
        console.error("Settlement History Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
exports.getSettlementHistory = getSettlementHistory;
//# sourceMappingURL=settlementController.js.map