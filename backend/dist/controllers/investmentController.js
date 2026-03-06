"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelInvestment = exports.deleteInvestment = exports.updateInvestment = exports.getInvestmentsByStatus = exports.getInvestmentStats = exports.getInvestmentById = exports.getUserInvestments = exports.createInvestment = void 0;
const database_1 = __importDefault(require("../config/database"));
const web3Service_1 = require("../services/web3Service");
const client_1 = require("@prisma/client");
const kyc_1 = __importDefault(require("../blockchain/kyc"));
const toNumber = (value) => {
    if (value === null || value === undefined)
        return 0;
    if (typeof value === 'number')
        return value;
    return Number(value.toString());
};
const sumDecimals = (values) => {
    return values.reduce((sum, val) => sum + toNumber(val), 0);
};
const createInvestment = async (req, res) => {
    try {
        const { hotelId, amount } = req.body;
        if (!req.user?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user.userId;
        if (!hotelId || !amount) {
            return res.status(400).json({
                message: 'Hotel ID and amount are required'
            });
        }
        if (amount < 100) {
            return res.status(400).json({
                message: 'Minimum investment is $100'
            });
        }
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            include: { kyc: true },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.walletAddress) {
            return res.status(403).json({
                message: 'Please connect and verify your wallet first',
                action: 'CONNECT_WALLET'
            });
        }
        const walletAddress = user.walletAddress;
        if (!user.kyc || user.kyc.status !== client_1.KycStatus.APPROVED) {
            return res.status(403).json({
                message: 'KYC approval required to invest',
                kycStatus: user.kyc?.status || 'NOT_SUBMITTED',
                action: 'COMPLETE_KYC'
            });
        }
        try {
            const isVerified = await kyc_1.default.isVerified(user.walletAddress);
            console.log('🔍 Blockchain KYC verification:', {
                wallet: walletAddress,
                verified: isVerified
            });
            if (!isVerified) {
                return res.status(403).json({
                    message: 'KYC not verified on blockchain. Please contact support.',
                    action: 'SYNC_KYC'
                });
            }
        }
        catch (error) {
            console.error('❌ Blockchain KYC check failed:', error);
            return res.status(500).json({
                message: 'Failed to verify KYC status on blockchain',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        const hotelAsset = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelId },
            select: {
                id: true,
                name: true,
                tokenPrice: true,
                totalTokens: true,
                tokensSold: true,
                status: true,
                tokenSymbol: true,
                tokenId: true,
            }
        });
        if (!hotelAsset) {
            return res.status(404).json({ message: 'Hotel asset not found' });
        }
        if (hotelAsset.status !== 'ACTIVE') {
            return res.status(400).json({
                message: 'This hotel is not available for investment'
            });
        }
        if (!hotelAsset.tokenPrice) {
            return res.status(500).json({
                message: 'Token price not set for this hotel'
            });
        }
        const tokenAmount = amount / hotelAsset.tokenPrice;
        const newTokensSold = (hotelAsset.tokensSold || 0) + tokenAmount;
        if (hotelAsset.totalTokens && newTokensSold > hotelAsset.totalTokens) {
            return res.status(400).json({
                message: 'Not enough tokens available',
                available: hotelAsset.totalTokens - (hotelAsset.tokensSold || 0),
                requested: tokenAmount
            });
        }
        const investment = await database_1.default.investment.create({
            data: {
                userId,
                hotelAssetId: hotelId,
                amount,
                tokenAmount,
                walletAddress,
                status: 'PENDING',
                blockchainStatus: 'PENDING',
                investedAmount: amount,
                earnedRewards: 0,
                pendingRewards: 0,
                stakedAmount: 0,
            }
        });
        await database_1.default.hotelAsset.update({
            where: { id: hotelId },
            data: { tokensSold: newTokensSold }
        });
        (async () => {
            try {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(' MINTING TOKENS ON BLOCKCHAIN');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Investment ID:', investment.id);
                console.log('Hotel Asset:', hotelAsset.name);
                console.log('Token ID:', hotelAsset.tokenId);
                console.log('Recipient:', walletAddress);
                console.log('Amount:', tokenAmount);
                const txHash = await web3Service_1.web3Service.processInvestment(hotelId, walletAddress, tokenAmount.toString());
                await database_1.default.investment.update({
                    where: { id: investment.id },
                    data: {
                        blockchainTxHash: txHash,
                        blockchainStatus: "MINTED",
                        status: "CONFIRMED"
                    }
                });
                console.log(' Investment minted! TX:', txHash);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            }
            catch (error) {
                console.error(' Minting failed:', error);
                await database_1.default.investment.update({
                    where: { id: investment.id },
                    data: {
                        blockchainStatus: "MINT_FAILED",
                        status: "FAILED",
                        blockchainError: error.message
                    }
                });
            }
        })();
        return res.status(201).json({
            message: `Successfully invested $${amount}! Minting ${tokenAmount} ${hotelAsset.tokenSymbol || 'tokens'} for ${hotelAsset.name}...`,
            investment: {
                id: investment.id,
                amount,
                tokenAmount,
                status: investment.status,
                blockchainStatus: investment.blockchainStatus,
                hotelAsset: {
                    name: hotelAsset.name,
                    tokenSymbol: hotelAsset.tokenSymbol,
                }
            }
        });
    }
    catch (error) {
        console.error(' Investment creation error:', error);
        return res.status(500).json({
            message: 'Failed to create investment',
            error: error.message
        });
    }
};
exports.createInvestment = createInvestment;
const getUserInvestments = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const investments = await database_1.default.investment.findMany({
            where: {
                userId,
                NOT: { blockchainStatus: "DELETED" }
            },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        tokenPrice: true,
                        tokenSymbol: true,
                        imageUrl: true,
                        location: true,
                        status: true,
                        apy: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        const stats = {
            totalInvested: investments.reduce((sum, inv) => sum + Number(inv.amount), 0),
            totalTokens: investments.reduce((sum, inv) => sum + Number(inv.tokenAmount), 0),
            totalEarned: investments.reduce((sum, inv) => sum + Number(inv.earnedRewards || 0), 0),
            totalPending: investments.reduce((sum, inv) => sum + Number(inv.pendingRewards || 0), 0),
            activeInvestments: investments.filter(inv => inv.status === 'CONFIRMED').length,
            pendingInvestments: investments.filter(inv => inv.status === 'PENDING').length,
            failedInvestments: investments.filter(inv => inv.status === 'FAILED').length,
        };
        const byStatus = {
            minted: investments.filter(inv => inv.blockchainStatus === 'MINTED').length,
            pending: investments.filter(inv => inv.blockchainStatus === 'PENDING').length,
            failed: investments.filter(inv => inv.blockchainStatus === 'MINT_FAILED').length,
        };
        res.json({
            success: true,
            data: investments,
            count: investments.length,
            stats,
            blockchainStatus: byStatus
        });
    }
    catch (error) {
        console.error('❌ Get investments error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getUserInvestments = getUserInvestments;
const getInvestmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const investment = await database_1.default.investment.findFirst({
            where: {
                id,
                userId,
                NOT: { blockchainStatus: "DELETED" }
            },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        tokenPrice: true,
                        tokenSymbol: true,
                        imageUrl: true,
                        location: true,
                        apy: true,
                        status: true,
                        tokenId: true,
                        totalTokens: true,
                        tokensSold: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        walletAddress: true,
                    }
                }
            }
        });
        if (!investment) {
            return res.status(404).json({
                success: false,
                error: "Investment not found"
            });
        }
        const amount = toNumber(investment.amount);
        const tokenAmount = toNumber(investment.tokenAmount);
        const earnedRewards = toNumber(investment.earnedRewards);
        const tokenPrice = toNumber(investment.hotelAsset.tokenPrice);
        const apy = toNumber(investment.hotelAsset.apy);
        const currentValue = tokenAmount * tokenPrice;
        const profitLoss = earnedRewards - amount;
        const profitLossPercentage = amount > 0 ? (earnedRewards / amount) * 100 : 0;
        const daysInvested = Math.floor((Date.now() - investment.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const estimatedAnnualReturn = amount * (apy / 100);
        res.json({
            success: true,
            data: {
                ...investment,
                metrics: {
                    currentValue,
                    profitLoss,
                    profitLossPercentage: profitLossPercentage.toFixed(2),
                    daysInvested,
                    estimatedAnnualReturn
                },
                blockchainConfirmed: investment.blockchainStatus === 'MINTED'
            }
        });
    }
    catch (error) {
        console.error('❌ Get investment error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getInvestmentById = getInvestmentById;
const getInvestmentStats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const investments = await database_1.default.investment.findMany({
            where: {
                userId,
                NOT: { blockchainStatus: "DELETED" }
            },
            include: {
                hotelAsset: {
                    select: {
                        apy: true,
                        tokenPrice: true,
                        name: true,
                    }
                }
            }
        });
        const totalInvested = investments.reduce((sum, inv) => sum + toNumber(inv.amount), 0);
        const totalEarned = investments.reduce((sum, inv) => sum + toNumber(inv.earnedRewards), 0);
        const totalPending = investments.reduce((sum, inv) => sum + toNumber(inv.pendingRewards), 0);
        const totalValue = investments.reduce((sum, inv) => sum + (toNumber(inv.tokenAmount) * toNumber(inv.hotelAsset.tokenPrice)), 0);
        const totalReturn = totalEarned + totalPending;
        const roi = totalInvested > 0 ? ((totalReturn / totalInvested) * 100) : 0;
        const assetDistribution = investments.reduce((acc, inv) => {
            const assetName = inv.hotelAsset.name;
            if (!acc[assetName]) {
                acc[assetName] = { count: 0, totalAmount: 0, totalTokens: 0 };
            }
            acc[assetName].count++;
            acc[assetName].totalAmount += toNumber(inv.amount);
            acc[assetName].totalTokens += toNumber(inv.tokenAmount);
            return acc;
        }, {});
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentInvestments = investments.filter(inv => new Date(inv.createdAt) >= thirtyDaysAgo);
        res.json({
            success: true,
            data: {
                portfolio: {
                    totalInvested,
                    totalEarned,
                    totalPending,
                    totalValue,
                    totalReturn,
                    roi: roi.toFixed(2),
                },
                counts: {
                    total: investments.length,
                    active: investments.filter(inv => inv.status === 'CONFIRMED').length,
                    pending: investments.filter(inv => inv.status === 'PENDING').length,
                    failed: investments.filter(inv => inv.status === 'FAILED').length,
                },
                assetDistribution,
                recentActivity: {
                    last30Days: recentInvestments.length,
                    recentAmount: recentInvestments.reduce((sum, inv) => sum + toNumber(inv.amount), 0),
                }
            }
        });
    }
    catch (error) {
        console.error(' Get stats error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getInvestmentStats = getInvestmentStats;
const getInvestmentsByStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { status } = req.query;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const whereClause = {
            userId,
            NOT: { blockchainStatus: "DELETED" }
        };
        if (status && typeof status === 'string') {
            whereClause.status = status.toUpperCase();
        }
        const investments = await database_1.default.investment.findMany({
            where: whereClause,
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        tokenSymbol: true,
                        imageUrl: true,
                        tokenPrice: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json({
            success: true,
            data: investments,
            count: investments.length,
            filter: status || 'all'
        });
    }
    catch (error) {
        console.error(' Get investments by status error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
exports.getInvestmentsByStatus = getInvestmentsByStatus;
const updateInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { amount } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { walletAddress: true }
        });
        if (!user?.walletAddress) {
            return res.status(403).json({
                success: false,
                error: "Wallet not connected. Please connect your wallet first.",
                action: 'CONNECT_WALLET'
            });
        }
        const investment = await database_1.default.investment.findFirst({
            where: {
                id,
                userId,
                NOT: { blockchainStatus: "DELETED" }
            },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        tokenPrice: true,
                        tokenSymbol: true,
                        totalTokens: true,
                        tokensSold: true,
                        status: true
                    }
                }
            }
        });
        if (!investment) {
            return res.status(404).json({
                success: false,
                error: "Investment not found"
            });
        }
        const blockchainStatus = investment.blockchainStatus || 'PENDING';
        if (blockchainStatus === "MINTED") {
            return res.status(400).json({
                success: false,
                error: "Cannot update minted investment. Tokens are already on blockchain.",
                blockchainTxHash: investment.blockchainTxHash
            });
        }
        if (!['PENDING', 'MINT_FAILED'].includes(blockchainStatus)) {
            return res.status(400).json({
                success: false,
                error: `Cannot update investment with status: ${blockchainStatus}`
            });
        }
        const newAmount = Number(amount);
        if (!amount || isNaN(newAmount) || newAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: "Valid amount is required"
            });
        }
        if (newAmount < 100) {
            return res.status(400).json({
                success: false,
                error: "Minimum investment is $100"
            });
        }
        if (investment.hotelAsset.status !== 'ACTIVE') {
            return res.status(400).json({
                success: false,
                error: "This hotel is no longer available for investment"
            });
        }
        const tokenPrice = toNumber(investment.hotelAsset.tokenPrice);
        if (tokenPrice <= 0) {
            return res.status(500).json({
                success: false,
                error: "Token price not set"
            });
        }
        const newTokenAmount = newAmount / tokenPrice;
        const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
        const currentInvestmentTokens = toNumber(investment.tokenAmount);
        const totalTokens = toNumber(investment.hotelAsset.totalTokens);
        const availableTokens = totalTokens - (currentTokensSold - currentInvestmentTokens);
        if (newTokenAmount > availableTokens) {
            return res.status(400).json({
                success: false,
                error: `Not enough tokens available. Only ${availableTokens.toFixed(2)} tokens remaining.`,
                available: availableTokens,
                requested: newTokenAmount
            });
        }
        const updatedInvestment = await database_1.default.$transaction(async (tx) => {
            const tokenDifference = newTokenAmount - currentInvestmentTokens;
            await tx.hotelAsset.update({
                where: { id: investment.hotelAssetId },
                data: { tokensSold: currentTokensSold + tokenDifference }
            });
            return tx.investment.update({
                where: { id: investment.id },
                data: {
                    amount: newAmount,
                    investedAmount: newAmount,
                    tokenAmount: newTokenAmount,
                    walletAddress: user.walletAddress,
                    updatedAt: new Date()
                },
                include: {
                    hotelAsset: {
                        select: {
                            id: true,
                            name: true,
                            tokenPrice: true,
                            tokenSymbol: true,
                            imageUrl: true,
                            location: true
                        }
                    }
                }
            });
        });
        res.json({
            success: true,
            data: updatedInvestment,
            message: `Investment updated to $${newAmount} (${newTokenAmount.toFixed(2)} ${investment.hotelAsset.tokenSymbol || 'tokens'})`
        });
    }
    catch (error) {
        console.error(' Update investment error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to update investment",
            details: error.message
        });
    }
};
exports.updateInvestment = updateInvestment;
const deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Not authenticated"
            });
        }
        const investment = await database_1.default.investment.findFirst({
            where: {
                id,
                userId,
                NOT: { blockchainStatus: "DELETED" }
            },
            include: {
                hotelAsset: {
                    select: {
                        name: true,
                        tokenSymbol: true,
                        tokensSold: true
                    }
                }
            }
        });
        if (!investment) {
            return res.status(404).json({
                success: false,
                error: "Investment not found"
            });
        }
        const blockchainStatus = investment.blockchainStatus || 'PENDING';
        if (blockchainStatus === "MINTED") {
            return res.status(400).json({
                success: false,
                error: "Cannot delete minted investment. Tokens are already on blockchain.",
                info: "Please contact support if you need to transfer or sell your tokens.",
                blockchainTxHash: investment.blockchainTxHash
            });
        }
        if (!['PENDING', 'MINT_FAILED'].includes(blockchainStatus)) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete investment with status: ${blockchainStatus}`
            });
        }
        await database_1.default.$transaction(async (tx) => {
            const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
            const investmentTokens = toNumber(investment.tokenAmount);
            await tx.hotelAsset.update({
                where: { id: investment.hotelAssetId },
                data: {
                    tokensSold: Math.max(0, currentTokensSold - investmentTokens)
                }
            });
            await tx.investment.update({
                where: { id },
                data: {
                    blockchainStatus: "DELETED",
                    status: "CANCELLED",
                    updatedAt: new Date()
                }
            });
        });
        res.json({
            success: true,
            message: `Investment of ${toNumber(investment.tokenAmount)} ${investment.hotelAsset.tokenSymbol || 'tokens'} deleted successfully`,
            data: {
                deletedAmount: toNumber(investment.amount),
                deletedTokens: toNumber(investment.tokenAmount),
                hotelName: investment.hotelAsset.name
            }
        });
    }
    catch (error) {
        console.error(' Delete investment error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to delete investment",
            details: error.message
        });
    }
};
exports.deleteInvestment = deleteInvestment;
const cancelInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { reason } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }
        const investment = await database_1.default.investment.findFirst({
            where: {
                id,
                userId,
                status: 'PENDING'
            },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        tokenSymbol: true,
                        tokensSold: true
                    }
                }
            }
        });
        if (!investment) {
            return res.status(404).json({
                success: false,
                error: "Pending investment not found"
            });
        }
        const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
        const investmentTokens = toNumber(investment.tokenAmount);
        const investmentAmount = toNumber(investment.amount);
        await database_1.default.$transaction(async (tx) => {
            await tx.hotelAsset.update({
                where: { id: investment.hotelAssetId },
                data: {
                    tokensSold: Math.max(0, currentTokensSold - investmentTokens)
                }
            });
            await tx.investment.update({
                where: { id },
                data: {
                    status: "CANCELLED",
                    blockchainStatus: "CANCELLED",
                    updatedAt: new Date()
                }
            });
        });
        res.json({
            success: true,
            message: `Investment of ${investmentTokens.toFixed(2)} ${investment.hotelAsset.tokenSymbol || 'tokens'} cancelled successfully`,
            data: {
                cancelledAmount: investmentAmount,
                cancelledTokens: investmentTokens,
                hotelName: investment.hotelAsset.name,
                reason: reason || 'No reason provided'
            }
        });
    }
    catch (error) {
        console.error(' Cancel investment error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to cancel investment",
            details: error.message
        });
    }
};
exports.cancelInvestment = cancelInvestment;
//# sourceMappingURL=investmentController.js.map