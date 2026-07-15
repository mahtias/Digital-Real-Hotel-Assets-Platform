"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminInvestments = exports.getAdminUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAdminUsers = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 20);
        const search = String(req.query.search || "").trim();
        const role = String(req.query.role || "").trim();
        const kyc = String(req.query.kyc || "").trim();
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
            ];
        }
        if (role)
            where.role = role.toUpperCase();
        if (kyc)
            where.kycStatus = kyc.toUpperCase();
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    kycStatus: true,
                    isEmailVerified: true,
                    isActive: true,
                    walletAddress: true,
                    createdAt: true,
                    _count: {
                        select: { investments: true, bookings: true },
                    },
                },
            }),
            database_1.default.user.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            success: true,
            data: users,
            pagination: {
                total,
                totalPages,
                page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (err) {
        console.error("getAdminUsers error:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getAdminUsers = getAdminUsers;
const getAdminInvestments = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 20);
        const search = String(req.query.search || "").trim();
        const status = String(req.query.status || "").trim();
        const where = {
            NOT: { blockchainStatus: "DELETED" },
        };
        if (status)
            where.status = status.toUpperCase();
        if (search) {
            where.OR = [
                { user: { email: { contains: search, mode: "insensitive" } } },
                { user: { firstName: { contains: search, mode: "insensitive" } } },
                { hotelAsset: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
        const [investments, total, stats] = await Promise.all([
            database_1.default.investment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { id: true, email: true, firstName: true, lastName: true, walletAddress: true },
                    },
                    hotelAsset: {
                        select: { id: true, name: true, tokenSymbol: true, tokenPrice: true },
                    },
                },
            }),
            database_1.default.investment.count({ where }),
            database_1.default.investment.aggregate({
                _sum: { investedAmount: true },
                _count: { id: true },
                where: { NOT: { blockchainStatus: "DELETED" } },
            }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            success: true,
            data: investments,
            stats: {
                totalInvestments: stats._count.id,
                totalInvested: Number(stats._sum.investedAmount || 0),
            },
            pagination: {
                total,
                totalPages,
                page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (err) {
        console.error("getAdminInvestments error:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getAdminInvestments = getAdminInvestments;
//# sourceMappingURL=adminController.js.map