"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvestment = exports.updateInvestment = exports.getInvestmentById = exports.getUserInvestments = exports.createInvestment = void 0;
const database_1 = __importDefault(require("../config/database"));
const web3Service_1 = require("../services/web3Service");
const createInvestment = async (req, res) => {
    try {
        const { hotelId, amount, walletAddress } = req.body;
        const userId = req.user?.userId;
        if (!hotelId || !amount || !walletAddress || !userId) {
            return res.status(400).json({ success: false, error: 'Missing fields' });
        }
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { kycStatus: true }
        });
        if (!user?.kycStatus || user.kycStatus !== 'APPROVED') {
            return res.status(403).json({ success: false, error: 'KYC required' });
        }
        const hotelAsset = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelId },
            select: {
                id: true,
                tokenPrice: true,
                name: true
            }
        });
        if (!hotelAsset?.tokenPrice) {
            return res.status(400).json({ success: false, error: 'Invalid hotel' });
        }
        const tokenAmount = Math.floor(Number(amount) / Number(hotelAsset.tokenPrice));
        const investment = await database_1.default.investment.create({
            data: {
                userId,
                hotelAssetId: hotelId,
                walletAddress,
                tokenAmount,
                investedAmount: Number(amount),
                amount: Number(amount),
                earnedRewards: 0,
                pendingRewards: 0,
                stakedAmount: 0,
                blockchainStatus: "PENDING"
            },
            include: {
                user: true,
                hotelAsset: true
            }
        });
        (async () => {
            try {
                const txHash = await web3Service_1.web3Service.mintInvestmentTokens(hotelId, walletAddress, tokenAmount);
                await database_1.default.investment.update({
                    where: { id: investment.id },
                    data: {
                        blockchainTxHash: txHash,
                        blockchainStatus: "MINTED"
                    }
                });
            }
            catch (error) {
                await database_1.default.investment.update({
                    where: { id: investment.id },
                    data: { blockchainStatus: "MINT_FAILED" }
                });
            }
        })();
        res.json({
            success: true,
            data: investment,
            message: ` Invested $${amount}! ${tokenAmount} tokens minting in ${hotelAsset.name}...`
        });
    }
    catch (error) {
        console.error(' Investment error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createInvestment = createInvestment;
const getUserInvestments = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Not authenticated" });
        const investments = await database_1.default.investment.findMany({
            where: { userId },
            include: { hotelAsset: true },
            orderBy: { createdAt: "desc" }
        });
        res.json(investments);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getUserInvestments = getUserInvestments;
const getInvestmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Not authenticated" });
        const investment = await database_1.default.investment.findFirst({
            where: { id, userId },
            include: {
                hotelAsset: {
                    select: { id: true, name: true, tokenPrice: true }
                }
            }
        });
        if (!investment) {
            return res.status(404).json({ success: false, error: "Investment not found" });
        }
        res.json({ success: true, data: investment });
    }
    catch (error) {
        console.error(' Get investment error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getInvestmentById = getInvestmentById;
const updateInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { amount, walletAddress } = req.body;
        if (!userId)
            return res.status(401).json({ error: "Not authenticated" });
        const investment = await database_1.default.investment.findFirst({
            where: { id, userId }
        });
        if (!investment) {
            return res.status(404).json({ success: false, error: "Investment not found" });
        }
        const updatedInvestment = await database_1.default.investment.update({
            where: { id: investment.id },
            data: {
                amount: amount ? Number(amount) : investment.amount,
                investedAmount: amount ? Number(amount) : investment.investedAmount,
                walletAddress: walletAddress || investment.walletAddress
            },
            include: { hotelAsset: true }
        });
        res.json({
            success: true,
            data: updatedInvestment,
            message: "Investment updated successfully"
        });
    }
    catch (error) {
        console.error(' Update investment error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.updateInvestment = updateInvestment;
const deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Not authenticated" });
        const investment = await database_1.default.investment.findFirst({
            where: { id, userId }
        });
        if (!investment) {
            return res.status(404).json({ success: false, error: "Investment not found" });
        }
        await database_1.default.investment.update({
            where: { id },
            data: {
                blockchainStatus: "DELETED",
                deletedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Investment deleted successfully"
        });
    }
    catch (error) {
        console.error(' Delete investment error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.deleteInvestment = deleteInvestment;
//# sourceMappingURL=investmentController.js.map