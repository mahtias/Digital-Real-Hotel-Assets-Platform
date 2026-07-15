"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeYield = exports.markClaimed = exports.getYieldHistory = exports.getClaimableYield = exports.getVaultStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const HotelYieldVaultService_1 = __importDefault(require("../services/HotelYieldVaultService"));
const getVaultStats = async (req, res) => {
    try {
        const stats = (await HotelYieldVaultService_1.default.getVaultStats());
        return res.json({
            success: true,
            data: {
                totalDeposited: stats[0].toString(),
                totalAllocated: stats[1].toString(),
                totalClaimed: stats[2].toString(),
                vaultBalance: stats[3].toString(),
            },
        });
    }
    catch (error) {
        console.error("Vault stats error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getVaultStats = getVaultStats;
const getClaimableYield = async (req, res) => {
    try {
        const { wallet } = req.params;
        const amount = (await HotelYieldVaultService_1.default.getClaimableYield(wallet));
        return res.json({
            success: true,
            wallet,
            claimable: amount.toString(),
        });
    }
    catch (error) {
        console.error("Claimable yield error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getClaimableYield = getClaimableYield;
const getYieldHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const yields = await database_1.default.investor_yields.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return res.json({
            success: true,
            count: yields.length,
            data: yields,
        });
    }
    catch (error) {
        console.error("Yield history error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getYieldHistory = getYieldHistory;
const markClaimed = async (req, res) => {
    try {
        const { userId, txHash } = req.body;
        const yieldRows = await database_1.default.investor_yields.findMany({
            where: { user_id: userId, status: "ALLOCATED" },
        });
        await database_1.default.investor_yields.updateMany({
            where: { user_id: userId, status: "ALLOCATED" },
            data: { status: "CLAIMED", tx_hash: txHash, paid_at: new Date() },
        });
        const earnedByInvestment = new Map();
        for (const row of yieldRows) {
            if (row.investment_id) {
                earnedByInvestment.set(row.investment_id, (earnedByInvestment.get(row.investment_id) ?? 0) + Number(row.amount));
            }
        }
        for (const [investmentId, earned] of earnedByInvestment) {
            await database_1.default.investment.update({
                where: { id: investmentId },
                data: { earnedRewards: { increment: earned }, pendingRewards: 0 },
            });
        }
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.markClaimed = markClaimed;
const distributeYield = async (req, res) => {
    try {
        const { distributionId, investorWallet, amount } = req.body;
        const result = await HotelYieldVaultService_1.default.addClaimable(distributionId, investorWallet, BigInt(amount));
        return res.json({
            success: true,
            hash: result.hash
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.distributeYield = distributeYield;
//# sourceMappingURL=yieldController.js.map