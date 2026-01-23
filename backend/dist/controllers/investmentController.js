"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvestment = exports.updateInvestment = exports.getInvestmentById = exports.createInvestment = exports.getUserInvestments = void 0;
const database_1 = __importDefault(require("../config/database"));
const web3Service_1 = require("../services/web3Service");
const client_1 = require("@prisma/client");
const getUserInvestments = async (req, res) => {
    try {
        const userId = req.user.id;
        const investments = await database_1.default.investment.findMany({
            where: { userId },
            include: { hotelAsset: true },
            orderBy: { createdAt: "desc" }
        });
        res.json(investments);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getUserInvestments = getUserInvestments;
const createInvestment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { hotelId, amount, tokenAmount } = req.body;
        const user = await database_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user?.walletAddress) {
            return res.status(400).json({ error: "User has no wallet connected" });
        }
        const isWhitelisted = await web3Service_1.web3Service.isUserWhitelisted(user.walletAddress);
        if (!isWhitelisted) {
            await web3Service_1.web3Service.whitelistUser(user.walletAddress);
        }
        const txHash = await web3Service_1.web3Service.mintInvestmentTokens(hotelId, user.walletAddress, tokenAmount);
        const investment = await database_1.default.investment.create({
            data: {
                userId,
                hotelAssetId: hotelId,
                transactionHash: txHash,
                tokenAmount,
                amount,
                earnedRewards: new client_1.Prisma.Decimal(0),
                investedAmount: new client_1.Prisma.Decimal(amount),
                pendingRewards: new client_1.Prisma.Decimal(0),
                stakedAmount: new client_1.Prisma.Decimal(0),
                createdBy: userId,
                createdById: userId
            },
        });
        res.json({
            success: true,
            investment,
            txHash
        });
    }
    catch (err) {
        console.error("Create investment error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.createInvestment = createInvestment;
const getInvestmentById = async (req, res) => {
    try {
        const investment = await database_1.default.investment.findUnique({
            where: { id: req.params.id },
            include: { hotelAsset: true, user: true },
        });
        res.json(investment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getInvestmentById = getInvestmentById;
const updateInvestment = async (req, res) => {
    try {
        const updated = await database_1.default.investment.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.updateInvestment = updateInvestment;
const deleteInvestment = async (req, res) => {
    try {
        await database_1.default.investment.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.deleteInvestment = deleteInvestment;
//# sourceMappingURL=investmentController.js.map