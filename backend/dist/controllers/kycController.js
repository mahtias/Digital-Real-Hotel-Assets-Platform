"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExpiredKYC = exports.getKYCStatistics = exports.syncBlockchainStatus = exports.verifyKYCOnBlockchain = exports.deleteKYC = exports.updateKYC = exports.reviewKYC = exports.getAllKYC = exports.getKYCById = exports.getKYCStatus = exports.submitKYC = void 0;
const KYCService_1 = require("../services/KYCService");
const kyc_types_1 = require("../types/kyc.types");
const client_1 = require("@prisma/client");
const submitKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const kycData = {
            userId: req.user.userId,
            ...req.body
        };
        const requiredFields = [
            'fullName',
            'dateOfBirth',
            'nationality',
            'documentType',
            'documentNumber',
            'address',
        ];
        for (const field of requiredFields) {
            if (!kycData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required field: ${field}`,
                });
            }
        }
        const kyc = await KYCService_1.KYCService.submitKYC(kycData);
        res.status(201).json({
            success: true,
            message: 'KYC submitted successfully',
            data: kyc,
        });
    }
    catch (error) {
        console.error('KYC submission error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit KYC',
        });
    }
};
exports.submitKYC = submitKYC;
const getKYCStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const kyc = await KYCService_1.KYCService.getKYCByUserId(req.user.userId);
        if (!kyc) {
            return res.status(404).json({
                success: false,
                message: 'KYC not found',
                data: {
                    status: kyc_types_1.KYCStatus.NOT_STARTED,
                },
            });
        }
        res.json({
            success: true,
            data: kyc,
        });
    }
    catch (error) {
        console.error('Get KYC status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get KYC status',
        });
    }
};
exports.getKYCStatus = getKYCStatus;
const getKYCById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const { id } = req.params;
        const kyc = await KYCService_1.KYCService.getKYCById(id);
        if (!kyc) {
            return res.status(404).json({
                success: false,
                message: 'KYC not found',
            });
        }
        if (req.user.role !== client_1.UserRole.ADMIN &&
            req.user.role !== client_1.UserRole.COMPLIANCE_OFFICER &&
            kyc.userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        res.json({
            success: true,
            data: kyc,
        });
    }
    catch (error) {
        console.error('Get KYC by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get KYC',
        });
    }
};
exports.getKYCById = getKYCById;
const getAllKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        if (req.user.role !== client_1.UserRole.ADMIN &&
            req.user.role !== client_1.UserRole.COMPLIANCE_OFFICER) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const verificationLevel = req.query.verificationLevel;
        const result = await KYCService_1.KYCService.getAllKYC({
            status,
            verificationLevel,
            page,
            limit,
        });
        res.json({
            success: true,
            data: result.kycs,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                pages: Math.ceil(result.total / result.limit),
            },
        });
    }
    catch (error) {
        console.error('Get all KYC error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get KYC submissions',
        });
    }
};
exports.getAllKYC = getAllKYC;
const reviewKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        if (req.user.role !== client_1.UserRole.ADMIN &&
            req.user.role !== client_1.UserRole.COMPLIANCE_OFFICER) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        const { id } = req.params;
        const reviewData = {
            ...req.body,
            reviewedBy: req.user.userId,
        };
        const validStatuses = [
            kyc_types_1.KYCStatus.APPROVED,
            kyc_types_1.KYCStatus.REJECTED,
            kyc_types_1.KYCStatus.RESUBMISSION_REQUIRED,
        ];
        if (!validStatuses.includes(reviewData.status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review status',
            });
        }
        if ((reviewData.status === kyc_types_1.KYCStatus.REJECTED ||
            reviewData.status === kyc_types_1.KYCStatus.RESUBMISSION_REQUIRED) &&
            !reviewData.rejectionReason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required',
            });
        }
        const kyc = await KYCService_1.KYCService.reviewKYC(id, reviewData);
        res.json({
            success: true,
            message: 'KYC reviewed successfully',
            data: kyc,
        });
    }
    catch (error) {
        console.error('Review KYC error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to review KYC',
        });
    }
};
exports.reviewKYC = reviewKYC;
const updateKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const { id } = req.params;
        const updateData = req.body;
        const kyc = await KYCService_1.KYCService.updateKYC(id, req.user.userId, updateData);
        res.json({
            success: true,
            message: 'KYC updated and resubmitted successfully',
            data: kyc,
        });
    }
    catch (error) {
        console.error('Update KYC error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update KYC',
        });
    }
};
exports.updateKYC = updateKYC;
const deleteKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const { id } = req.params;
        await KYCService_1.KYCService.deleteKYC(id, req.user.userId, req.user.role);
        res.json({
            success: true,
            message: 'KYC deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete KYC error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete KYC',
        });
    }
};
exports.deleteKYC = deleteKYC;
const verifyKYCOnBlockchain = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const isValid = await KYCService_1.KYCService.verifyKYCOnBlockchain(walletAddress);
        const record = await KYCService_1.KYCService.getBlockchainKYCRecord(walletAddress);
        res.json({
            success: true,
            data: {
                isValid,
                record,
            },
        });
    }
    catch (error) {
        console.error('Verify blockchain KYC error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify blockchain KYC',
        });
    }
};
exports.verifyKYCOnBlockchain = verifyKYCOnBlockchain;
const syncBlockchainStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        await KYCService_1.KYCService.syncBlockchainStatus(req.user.userId);
        res.json({
            success: true,
            message: 'Blockchain status synced successfully',
        });
    }
    catch (error) {
        console.error('Sync blockchain status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to sync blockchain status',
        });
    }
};
exports.syncBlockchainStatus = syncBlockchainStatus;
const getKYCStatistics = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        if (req.user.role !== client_1.UserRole.ADMIN &&
            req.user.role !== client_1.UserRole.COMPLIANCE_OFFICER) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        const statistics = await KYCService_1.KYCService.getStatistics();
        res.json({
            success: true,
            data: statistics,
        });
    }
    catch (error) {
        console.error('Get KYC statistics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get statistics',
        });
    }
};
exports.getKYCStatistics = getKYCStatistics;
const checkExpiredKYC = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        if (req.user.role !== client_1.UserRole.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        await KYCService_1.KYCService.checkAndUpdateExpiredKYC();
        res.json({
            success: true,
            message: 'Expired KYC records updated',
        });
    }
    catch (error) {
        console.error('Check expired KYC error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to check expired KYC',
        });
    }
};
exports.checkExpiredKYC = checkExpiredKYC;
//# sourceMappingURL=kycController.js.map