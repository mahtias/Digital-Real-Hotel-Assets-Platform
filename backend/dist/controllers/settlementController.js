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
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const status = req.query.status;
        const hotelId = req.query.hotelId;
        const where = {};
        if (status && status !== "ALL") {
            where.status = status;
        }
        if (hotelId) {
            where.hotelAssetId = hotelId;
        }
        if (search) {
            where.OR = [
                {
                    txHash: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    hotelWallet: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    booking: {
                        bookingCode: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    hotelAsset: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }
        const [settlements, total] = await Promise.all([
            database_1.default.settlement.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    booking: {
                        select: {
                            bookingCode: true,
                        },
                    },
                    hotelAsset: {
                        select: {
                            id: true,
                            name: true,
                            location: true,
                        },
                    },
                },
            }),
            database_1.default.settlement.count({
                where,
            }),
        ]);
        const formatted = settlements.map((s) => ({
            id: s.id,
            bookingCode: s.booking?.bookingCode,
            hotelName: s.hotelAsset?.name,
            hotelLocation: s.hotelAsset?.location,
            amount: Number(s.amount),
            currency: s.currency,
            status: s.status,
            txHash: s.txHash,
            hotelWallet: s.hotelWallet,
            createdAt: s.createdAt,
        }));
        return res.json({
            success: true,
            data: formatted,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
            filters: {
                status,
                hotelId,
                search,
            },
        });
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