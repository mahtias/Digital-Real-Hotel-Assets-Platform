"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactivateUser = exports.getUserStatistics = exports.deactivateUser = exports.updateUserRole = exports.getAllUsers = exports.getUserTransactions = exports.getUserPortfolio = exports.updateUserProfile = exports.getUserProfile = void 0;
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        res.json({
            success: true,
            data: {
                id: userId,
                email: req.user?.email,
                role: req.user?.role,
                profile: {
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    avatar: '/uploads/avatars/default.jpg',
                    kycStatus: 'pending',
                    isVerified: false
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserProfile = getUserProfile;
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
        const userId = req.user?.userId;
        res.json({
            success: true,
            data: {
                totalInvestment: 50000,
                totalProperties: 5,
                totalTokens: 500,
                currentValue: 52500,
                totalReturn: 2500,
                returnPercentage: 5.0,
                properties: [
                    {
                        propertyId: 'prop_1',
                        propertyName: 'Luxury Apartment in Downtown',
                        tokensOwned: 100,
                        investmentAmount: 10000,
                        currentValue: 10500,
                        returnAmount: 500,
                        returnPercentage: 5.0,
                        purchaseDate: new Date('2024-01-15'),
                        propertyImage: '/uploads/properties/prop1.jpg'
                    },
                    {
                        propertyId: 'prop_2',
                        propertyName: 'Commercial Office Space',
                        tokensOwned: 200,
                        investmentAmount: 20000,
                        currentValue: 21000,
                        returnAmount: 1000,
                        returnPercentage: 5.0,
                        purchaseDate: new Date('2024-02-20'),
                        propertyImage: '/uploads/properties/prop2.jpg'
                    }
                ],
                recentDividends: [
                    {
                        propertyName: 'Luxury Apartment in Downtown',
                        amount: 250,
                        date: new Date('2024-03-01'),
                        status: 'paid'
                    },
                    {
                        propertyName: 'Commercial Office Space',
                        amount: 500,
                        date: new Date('2024-03-01'),
                        status: 'paid'
                    }
                ]
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch portfolio',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserPortfolio = getUserPortfolio;
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
        const validRoles = ['user', 'admin', 'property_manager', 'compliance_officer', 'finance_manager'];
        if (!validRoles.includes(role)) {
            res.status(400).json({
                success: false,
                message: 'Invalid role',
                validRoles
            });
            return;
        }
        if (userId === adminId) {
            res.status(403).json({
                success: false,
                message: 'Cannot change your own role'
            });
            return;
        }
        res.json({
            success: true,
            message: 'User role updated successfully',
            data: {
                userId,
                role,
                updatedBy: adminId,
                updatedAt: new Date()
            }
        });
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
        const { reason } = req.body;
        const adminId = req.user?.userId;
        if (userId === adminId) {
            res.status(403).json({
                success: false,
                message: 'Cannot deactivate your own account'
            });
            return;
        }
        res.json({
            success: true,
            message: 'User deactivated successfully',
            data: {
                userId,
                deactivatedBy: adminId,
                reason,
                deactivatedAt: new Date()
            }
        });
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
        const adminId = req.user?.userId;
        res.json({
            success: true,
            message: 'User reactivated successfully',
            data: {
                userId,
                reactivatedBy: adminId,
                reactivatedAt: new Date()
            }
        });
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
//# sourceMappingURL=userController.js.map