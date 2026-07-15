"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.reactivateUser = exports.getUserStatistics = exports.deactivateUser = exports.updateUserRole = exports.getAllUsers = exports.getUserTransactions = exports.updateWalletAddress = exports.confirmAllInvestments = exports.getUserPortfolio = exports.updateUserProfile = exports.getUserTokens = void 0;
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const kyc_1 = __importDefault(require("../blockchain/kyc"));
const getUserTokens = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const investments = await database_1.default.investment.findMany({
            where: {
                userId,
                status: 'CONFIRMED',
                deletedAt: null
            },
            include: {
                hotelAsset: {
                    select: {
                        tokenPrice: true,
                        name: true
                    }
                }
            }
        });
        const totalHAT = investments.reduce((sum, inv) => {
            const amount = inv.amount ? parseFloat(inv.amount.toString()) : 0;
            const tokenPrice = inv.hotelAsset?.tokenPrice ? parseFloat(inv.hotelAsset.tokenPrice.toString()) : 1;
            return sum + (amount / tokenPrice);
        }, 0);
        const totalValue = investments.reduce((sum, inv) => {
            const amount = inv.amount ? parseFloat(inv.amount.toString()) : 0;
            return sum + amount;
        }, 0);
        res.json({
            success: true,
            data: {
                totalHAT: totalHAT.toFixed(2),
                properties: investments.length,
                totalValue: totalValue.toFixed(2),
                investments: investments.map(inv => {
                    const amount = inv.amount ? parseFloat(inv.amount.toString()) : 0;
                    const tokenPrice = inv.hotelAsset?.tokenPrice ? parseFloat(inv.hotelAsset.tokenPrice.toString()) : 1;
                    return {
                        name: inv.hotelAsset?.name || 'Unknown',
                        amount: amount.toFixed(2),
                        tokens: (amount / tokenPrice).toFixed(2),
                        status: inv.status
                    };
                })
            }
        });
    }
    catch (error) {
        console.error('Tokens error:', error);
        res.status(500).json({ success: false, message: 'Tokens fetch failed' });
    }
};
exports.getUserTokens = getUserTokens;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { firstName, lastName, phone, bio, address } = req.body;
        const avatar = req.file;
        const updates = {
            firstName,
            lastName,
            phone,
            bio,
            address,
            updatedAt: new Date()
        };
        if (avatar) {
            updates.avatar = `/uploads/avatars/${avatar.filename}`;
        }
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: userId,
                ...updates
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserPortfolio = async (req, res) => {
    try {
        console.log("🔥 PORTFOLIO DEBUG - START:", {
            timestamp: new Date().toISOString(),
            userId: req.user?.userId,
            userEmail: req.user?.email,
            authHeader: req.headers.authorization?.slice(0, 50),
            allInvestmentsCount: await database_1.default.investment.count(),
            studioInvestments: await database_1.default.investment.count({
                where: { userId: { contains: 'studio' } }
            }),
            pendingInvestments: await database_1.default.investment.count({
                where: { status: { in: ['PENDING', 'CONFIRMED'] } }
            })
        });
        const userId = req.user?.userId;
        if (!userId) {
            console.log("❌ NO USER ID - AUTHENTICATION FAILED!");
            console.log("FULL REQ.USER:", JSON.stringify(req.user));
            return res.status(401).json({
                success: false,
                message: "User not authenticated - check token"
            });
        }
        console.log("✅ USER FOUND, FETCHING INVESTMENTS FOR:", userId);
        const investments = await database_1.default.investment.findMany({
            where: {
                userId,
                status: { in: ['PENDING', 'CONFIRMED'] }
            },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        country: true,
                        tokenSymbol: true,
                        tokenPrice: true,
                        apy: true,
                        imageUrl: true,
                        occupancyRate: true,
                        starRating: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        console.log("📊 FOUND INVESTMENTS:", investments.length, "for user:", userId);
        const totalInvestment = investments.reduce((sum, inv) => sum + parseFloat(inv.investedAmount.toString()), 0);
        const totalTokens = investments.reduce((sum, inv) => sum + Number(inv.tokenAmount), 0);
        const totalProperties = investments.length;
        const currentValue = totalInvestment * 1.05;
        console.log("💰 PORTFOLIO SUMMARY:", {
            totalInvestment: Math.round(totalInvestment),
            totalProperties,
            totalTokens
        });
        res.json({
            success: true,
            data: {
                totalInvestment: Math.round(totalInvestment),
                totalProperties,
                totalTokens,
                currentValue: Math.round(currentValue),
                totalReturn: Math.round(currentValue - totalInvestment),
                returnPercentage: 5.0,
                properties: investments.map(inv => ({
                    propertyId: inv.hotelAssetId,
                    propertyName: `${inv.hotelAsset.name} (${inv.hotelAsset.location})`,
                    tokensOwned: Number(inv.tokenAmount),
                    investmentAmount: parseFloat(inv.investedAmount.toString()),
                    currentValue: parseFloat(inv.investedAmount.toString()) * 1.05,
                    returnAmount: parseFloat(inv.investedAmount.toString()) * 0.05,
                    returnPercentage: 5.0,
                    purchaseDate: inv.createdAt.toISOString(),
                    propertyImage: inv.hotelAsset.imageUrl,
                    tokenSymbol: inv.hotelAsset.tokenSymbol,
                    apy: inv.hotelAsset.apy,
                    occupancyRate: inv.hotelAsset.occupancyRate,
                    starRating: inv.hotelAsset.starRating,
                    status: inv.status
                })),
                recentDividends: [
                    {
                        propertyName: '曼谷瑰丽酒店',
                        amount: 42.5,
                        date: new Date(Date.now() - 86400000 * 30).toISOString(),
                        status: 'paid'
                    }
                ]
            }
        });
    }
    catch (error) {
        console.error(' PORTFOLIO ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch portfolio',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserPortfolio = getUserPortfolio;
const confirmAllInvestments = async (req, res) => {
    try {
        const { userId } = req.body;
        const adminId = req.user?.userId;
        const targetUserId = userId || adminId;
        const updated = await database_1.default.investment.updateMany({
            where: {
                userId: targetUserId,
                status: 'PENDING'
            },
            data: {
                status: 'CONFIRMED'
            }
        });
        res.json({
            success: true,
            message: `Confirmed ${updated.count} investments`,
            userId: targetUserId,
            count: updated.count
        });
    }
    catch (error) {
        console.error('Confirm investments error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to confirm investments'
        });
    }
};
exports.confirmAllInvestments = confirmAllInvestments;
const updateWalletAddress = async (req, res) => {
    try {
        console.log("=== UPDATE WALLET ===");
        console.log("req.user:", req.user);
        const { walletAddress } = req.body;
        const userId = req.user?.userId;
        console.log("userId:", userId);
        console.log("body:", req.body);
        console.log(' Updating wallet for user:', userId);
        console.log(' New wallet address:', walletAddress);
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Ethereum address format'
            });
        }
        const existingWallet = await database_1.default.user.findFirst({
            where: {
                walletAddress,
                id: { not: userId }
            }
        });
        if (existingWallet) {
            return res.status(400).json({
                success: false,
                message: 'Wallet address already registered to another account'
            });
        }
        const currentUser = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                walletAddress: true,
            },
        });
        const walletChanged = currentUser?.walletAddress?.toLowerCase() !== walletAddress.toLowerCase();
        const updatedUser = await database_1.default.user.update({
            where: { id: userId },
            data: {
                walletAddress,
                ...(walletChanged && {
                    kycBlockchainSynced: false,
                    kycBlockchainTxHash: null,
                    kycLastVerified: null,
                    kycSyncAttempts: 0,
                    kycSyncError: null,
                }),
            },
            include: {
                kyc: true,
            },
        });
        console.log(' Wallet updated in database');
        if (updatedUser.kyc && updatedUser.kyc.status === client_1.KycStatus.APPROVED) {
            try {
                console.log(' Syncing KYC approval to blockchain...');
                const txHash = await kyc_1.default.verifyUser(walletAddress);
                if (txHash && txHash !== 'ALREADY_VERIFIED') {
                    console.log(' KYC synced to blockchain:', txHash);
                    await database_1.default.kyc.update({
                        where: { id: updatedUser.kyc.id },
                        data: { blockchainTx: txHash }
                    });
                }
                else {
                    console.log('  User already verified on blockchain');
                }
            }
            catch (error) {
                console.error(' Blockchain sync failed:', error.message);
            }
        }
        let blockchainVerified = false;
        try {
            blockchainVerified = await kyc_1.default.isVerified(walletAddress);
        }
        catch (error) {
            console.error(' Blockchain verification check failed:', error);
        }
        return res.json({
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                walletAddress: updatedUser.walletAddress,
                kycStatus: updatedUser.kycStatus,
                blockchain: {
                    verified: blockchainVerified,
                    txHash: updatedUser.kyc?.blockchainTx || null
                }
            },
            message: 'Wallet address updated successfully'
        });
    }
    catch (error) {
        console.error(' Update wallet error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateWalletAddress = updateWalletAddress;
const getUserTransactions = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type, status, startDate, endDate, page = 1, limit = 10 } = req.query;
        res.json({
            success: true,
            data: {
                transactions: [
                    {
                        id: 'tx_1',
                        type: 'investment',
                        propertyName: 'Luxury Apartment in Downtown',
                        amount: 10000,
                        tokens: 100,
                        status: 'completed',
                        date: new Date('2024-01-15'),
                        transactionHash: '0x1234...5678'
                    },
                    {
                        id: 'tx_2',
                        type: 'dividend',
                        propertyName: 'Commercial Office Space',
                        amount: 500,
                        status: 'completed',
                        date: new Date('2024-03-01'),
                        transactionHash: '0x8765...4321'
                    },
                    {
                        id: 'tx_3',
                        type: 'investment',
                        propertyName: 'Residential Complex',
                        amount: 5000,
                        tokens: 50,
                        status: 'pending',
                        date: new Date('2024-03-15')
                    }
                ],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: 3,
                    pages: 1
                },
                summary: {
                    totalInvestments: 15000,
                    totalDividends: 500,
                    pendingTransactions: 1
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserTransactions = getUserTransactions;
const getAllUsers = async (req, res) => {
    try {
        const { role, kycStatus, isVerified, search, page = 1, limit = 10 } = req.query;
        res.json({
            success: true,
            data: {
                users: [
                    {
                        id: 'user_1',
                        email: 'john@example.com',
                        firstName: 'John',
                        lastName: 'Doe',
                        role: 'user',
                        kycStatus: 'approved',
                        isVerified: true,
                        totalInvestment: 50000,
                        joinedAt: new Date('2024-01-01'),
                        lastLogin: new Date('2024-03-15')
                    },
                    {
                        id: 'user_2',
                        email: 'jane@example.com',
                        firstName: 'Jane',
                        lastName: 'Smith',
                        role: 'user',
                        kycStatus: 'pending',
                        isVerified: false,
                        totalInvestment: 0,
                        joinedAt: new Date('2024-03-10'),
                        lastLogin: new Date('2024-03-14')
                    },
                    {
                        id: 'user_3',
                        email: 'admin@example.com',
                        firstName: 'Admin',
                        lastName: 'User',
                        role: 'admin',
                        kycStatus: 'approved',
                        isVerified: true,
                        totalInvestment: 0,
                        joinedAt: new Date('2023-01-01'),
                        lastLogin: new Date('2024-03-16')
                    }
                ],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: 3,
                    pages: 1
                },
                statistics: {
                    totalUsers: 3,
                    verifiedUsers: 2,
                    pendingKyc: 1,
                    activeUsers: 3
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const adminId = req.user?.userId;
        const validRoles = ['USER', 'ADMIN', 'PROPERTY_MANAGER', 'COMPLIANCE_OFFICER', 'FINANCE_MANAGER'];
        if (!role || !validRoles.includes(role.toUpperCase())) {
            res.status(400).json({ success: false, message: 'Invalid role', validRoles });
            return;
        }
        if (userId === adminId) {
            res.status(403).json({ success: false, message: 'Cannot change your own role' });
            return;
        }
        const updated = await database_1.default.user.update({
            where: { id: userId },
            data: { role: role.toUpperCase() },
            select: { id: true, email: true, role: true },
        });
        res.json({ success: true, message: 'User role updated', data: updated });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateUserRole = updateUserRole;
const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user?.userId;
        if (userId === adminId) {
            res.status(403).json({ success: false, message: 'Cannot deactivate your own account' });
            return;
        }
        const updated = await database_1.default.user.update({
            where: { id: userId },
            data: { isActive: false },
            select: { id: true, email: true, isActive: true },
        });
        res.json({ success: true, message: 'User deactivated', data: updated });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deactivateUser = deactivateUser;
const getUserStatistics = async (req, res) => {
    try {
        const { userId } = req.params;
        res.json({
            success: true,
            data: {
                investments: {
                    total: 50000,
                    properties: 5,
                    tokens: 500
                },
                returns: {
                    total: 2500,
                    percentage: 5.0,
                    monthly: 208.33
                },
                activity: {
                    lastLogin: new Date(),
                    totalLogins: 150,
                    lastTransaction: new Date('2024-03-15')
                },
                kyc: {
                    status: 'approved',
                    submittedAt: new Date('2024-01-05'),
                    approvedAt: new Date('2024-01-10')
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserStatistics = getUserStatistics;
const reactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updated = await database_1.default.user.update({
            where: { id: userId },
            data: { isActive: true },
            select: { id: true, email: true, isActive: true },
        });
        res.json({ success: true, message: 'User reactivated', data: updated });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to reactivate user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.reactivateUser = reactivateUser;
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                lastName: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                kycApprovedAt: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        let blockchainVerified = false;
        let blockchainError = null;
        if (user.walletAddress && user.kycStatus === 'APPROVED') {
            try {
                blockchainVerified = await kyc_1.default.isVerified(user.walletAddress);
            }
            catch (error) {
                console.error('Blockchain check error:', error);
                blockchainError = error.message;
            }
        }
        return res.json({
            success: true,
            data: {
                ...user,
                blockchain: {
                    verified: blockchainVerified,
                    error: blockchainError
                }
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=userController.js.map