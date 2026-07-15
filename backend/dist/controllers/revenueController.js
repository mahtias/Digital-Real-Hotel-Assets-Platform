"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQloHotelStats = exports.getHotelRevenue = void 0;
const database_1 = __importDefault(require("../config/database"));
const qloService_1 = require("../services/qloService");
const getHotelRevenue = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const hotelWhere = {};
        if (search) {
            hotelWhere.name = {
                contains: search,
                mode: "insensitive",
            };
        }
        const [hotels, total] = await Promise.all([
            database_1.default.hotelAsset.findMany({
                where: hotelWhere,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            }),
            database_1.default.hotelAsset.count({
                where: hotelWhere,
            }),
        ]);
        const hotelIds = hotels.map((h) => h.id);
        const [revenues, pendingSettlements, completedSettlements] = await Promise.all([
            database_1.default.booking.groupBy({
                by: ["hotelAssetId"],
                where: {
                    hotelAssetId: {
                        in: hotelIds,
                    },
                    status: "PAID",
                },
                _sum: {
                    totalPrice: true,
                    platformFee: true,
                },
            }),
            database_1.default.settlement.groupBy({
                by: ["hotelAssetId"],
                where: {
                    hotelAssetId: {
                        in: hotelIds,
                    },
                    status: "PENDING",
                },
                _sum: {
                    amount: true,
                },
            }),
            database_1.default.settlement.groupBy({
                by: ["hotelAssetId"],
                where: {
                    hotelAssetId: {
                        in: hotelIds,
                    },
                    status: "COMPLETED",
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        const revenueMap = new Map(revenues.map((r) => [r.hotelAssetId, r]));
        const pendingMap = new Map(pendingSettlements.map((p) => [
            p.hotelAssetId,
            Number(p._sum.amount || 0),
        ]));
        const completedMap = new Map(completedSettlements.map((p) => [
            p.hotelAssetId,
            Number(p._sum.amount || 0),
        ]));
        const data = hotels.map((hotel) => {
            const revenue = revenueMap.get(hotel.id);
            const totalRevenue = Number(revenue?._sum.totalPrice || 0);
            const platformFees = Number(revenue?._sum.platformFee || 0);
            const investorYield = totalRevenue * 0.1;
            const hotelNetRevenue = totalRevenue -
                platformFees -
                investorYield;
            return {
                hotelId: hotel.id,
                hotelName: hotel.name,
                totalRevenue,
                platformFees,
                platformFeeRate: 0.01,
                investorYield,
                investorYieldRate: 0.1,
                hotelNetRevenue,
                pending: pendingMap.get(hotel.id) || 0,
                paid: completedMap.get(hotel.id) || 0,
            };
        });
        return res.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
            filters: {
                search,
            },
        });
    }
    catch (err) {
        console.error("Revenue Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
exports.getHotelRevenue = getHotelRevenue;
const getQloHotelStats = async (req, res) => {
    try {
        const qloHotelId = Number(req.params.hotelId);
        if (!qloHotelId) {
            return res.status(400).json({ success: false, message: "Invalid hotelId" });
        }
        const today = new Date();
        const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1)
            .toISOString().split("T")[0];
        const defaultTo = today.toISOString().split("T")[0];
        const dateFrom = req.query.from || defaultFrom;
        const dateTo = req.query.to || defaultTo;
        const stats = await qloService_1.qloService.getHotelStats(qloHotelId, dateFrom, dateTo);
        return res.json({ success: true, data: stats });
    }
    catch (err) {
        console.error("QloApps stats error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getQloHotelStats = getQloHotelStats;
//# sourceMappingURL=revenueController.js.map