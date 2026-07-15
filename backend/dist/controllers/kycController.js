"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKYCStatistics = exports.getKYCStatus = exports.checkKYCStatus = exports.getPendingKYCs = exports.deleteKYC = exports.updateKYC = exports.reviewKYC = exports.getAllKYC = exports.getKYCById = exports.submitKYC = void 0;
const database_1 = __importDefault(require("../config/database"));
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sendAdminKycEmail_1 = require("../utils/sendAdminKycEmail");
const kyc_1 = __importDefault(require("../blockchain/kyc"));
const web3Service_1 = require("../services/web3Service");
const uploadDir = path_1.default.join(__dirname, '../../uploads/kyc');
const deleteFile = (fileName) => {
    if (!fileName)
        return;
    const filePath = path_1.default.join(uploadDir, fileName);
    if (fs_1.default.existsSync(filePath))
        fs_1.default.unlinkSync(filePath);
};
const submitKYC = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const files = req.files;
        const data = {
            userId,
            fullName: req.body.fullName,
            dateOfBirth: new Date(req.body.dateOfBirth),
            nationality: req.body.nationality,
            address: req.body.address,
            documentType: req.body.documentType,
            documentNumber: req.body.documentNumber,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            country: req.body.country,
            documentFront: files?.documentFront?.[0]?.filename ?? null,
            documentBack: files?.documentBack?.[0]?.filename ?? null,
            selfieImage: files?.selfieImage?.[0]?.filename ?? null,
            addressProof: files?.addressProof?.[0]?.filename ?? null,
        };
        const filePath = path_1.default.join(uploadDir, files.documentFront[0].filename);
        const buffer = fs_1.default.readFileSync(filePath);
        const documentHash = (0, ethers_1.keccak256)(buffer);
        const kycRecord = await database_1.default.kyc.create({
            data: {
                ...data,
                documentHash
            }
        });
        await database_1.default.user.update({
            where: { id: userId },
            data: { kycSubmittedAt: new Date() }
        });
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });
        if (user)
            (0, sendAdminKycEmail_1.sendAdminKycEmail)(user);
        return res.json({ success: true, data: kycRecord });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.submitKYC = submitKYC;
const getKYCById = async (req, res) => {
    try {
        const kycRecord = await database_1.default.kyc.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        email: true,
                        walletAddress: true
                    }
                }
            }
        });
        if (!kycRecord)
            return res.status(404).json({ success: false, message: 'KYC not found' });
        return res.json({ success: true, data: kycRecord });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getKYCById = getKYCById;
const getAllKYC = async (req, res) => {
    try {
        const list = await database_1.default.kyc.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        walletAddress: true,
                        kycStatus: true
                    }
                }
            }
        });
        return res.json({ success: true, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllKYC = getAllKYC;
const reviewKYC = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const kycId = req.params.id;
        console.log('🔍 Starting KYC review process...');
        console.log('📋 KYC ID:', kycId);
        console.log('📊 New Status:', status);
        const kycRecord = await database_1.default.kyc.findUnique({
            where: { id: kycId },
            include: {
                user: {
                    select: { id: true, email: true, walletAddress: true }
                }
            }
        });
        if (!kycRecord) {
            return res.status(404).json({
                success: false,
                message: 'KYC record not found'
            });
        }
        console.log('👤 User:', kycRecord.user.email);
        console.log('💳 Wallet:', kycRecord.user.walletAddress);
        const data = {
            status,
            reviewedAt: new Date(),
        };
        if (status === "REJECTED") {
            if (!rejectionReason) {
                return res.status(400).json({
                    success: false,
                    message: 'Rejection reason is required'
                });
            }
            data.rejectionReason = rejectionReason;
            const updated = await database_1.default.kyc.update({
                where: { id: kycId },
                data
            });
            await database_1.default.user.update({
                where: { id: updated.userId },
                data: { kycStatus: "REJECTED" }
            });
            console.log(' KYC Rejected');
            return res.json({
                success: true,
                data: updated,
                message: 'KYC rejected successfully'
            });
        }
        if (status === "APPROVED") {
            const { walletAddress } = kycRecord.user;
            if (!walletAddress)
                throw new Error('User wallet address missing');
            if (!kycRecord.documentHash)
                throw new Error('Document hash missing');
            let txHash = null;
            try {
                txHash = await web3Service_1.web3Service.registerKyc(walletAddress, kycRecord.documentHash);
                console.log('Blockchain KYC synced, txHash:', txHash);
            }
            catch (err) {
                console.error('Blockchain sync failed:', err instanceof Error ? err.message : err);
            }
            const updated = await database_1.default.kyc.update({
                where: { id: kycId },
                data: {
                    ...data,
                    approvedAt: new Date(),
                    rejectionReason: null,
                    blockchainTx: txHash
                }
            });
            await database_1.default.user.update({
                where: { id: updated.userId },
                data: { kycStatus: 'APPROVED', kycApprovedAt: new Date() }
            });
            return res.json({
                success: true,
                status: updated.status,
                data: updated,
                message: txHash
                    ? 'KYC approved and synced to blockchain'
                    : 'KYC approved but blockchain sync failed',
                txHash
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Invalid status'
        });
    }
    catch (error) {
        console.error(' Review KYC error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.reviewKYC = reviewKYC;
const updateKYC = async (req, res) => {
    try {
        const existing = await database_1.default.kyc.findUnique({
            where: { id: req.params.id }
        });
        if (!existing)
            return res.status(404).json({ success: false, message: 'KYC not found' });
        const files = req.files;
        const updatedData = {
            fullName: req.body.fullName ?? existing.fullName,
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : existing.dateOfBirth,
            nationality: req.body.nationality ?? existing.nationality,
            address: req.body.address ?? existing.address,
            documentType: req.body.documentType ?? existing.documentType,
            documentNumber: req.body.documentNumber ?? existing.documentNumber,
            city: req.body.city ?? existing.city,
            state: req.body.state ?? existing.state,
            postalCode: req.body.postalCode ?? existing.postalCode,
            country: req.body.country ?? existing.country,
            status: "PENDING",
            rejectionReason: null,
        };
        if (files?.documentFront?.[0]) {
            deleteFile(existing.documentFront);
            updatedData.documentFront = files.documentFront[0].filename;
        }
        if (files?.documentBack?.[0]) {
            deleteFile(existing.documentBack);
            updatedData.documentBack = files.documentBack[0].filename;
        }
        if (files?.selfieImage?.[0]) {
            deleteFile(existing.selfieImage);
            updatedData.selfieImage = files.selfieImage[0].filename;
        }
        if (files?.addressProof?.[0]) {
            deleteFile(existing.addressProof);
            updatedData.addressProof = files.addressProof[0].filename;
        }
        const updated = await database_1.default.kyc.update({
            where: { id: existing.id },
            data: updatedData
        });
        return res.json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateKYC = updateKYC;
const deleteKYC = async (req, res) => {
    try {
        const existing = await database_1.default.kyc.findUnique({
            where: { id: req.params.id }
        });
        if (!existing)
            return res.status(404).json({ success: false, message: 'KYC not found' });
        deleteFile(existing.documentFront);
        deleteFile(existing.documentBack);
        deleteFile(existing.selfieImage);
        deleteFile(existing.addressProof);
        await database_1.default.kyc.delete({ where: { id: existing.id } });
        return res.json({ success: true, message: 'KYC deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteKYC = deleteKYC;
const getPendingKYCs = async () => {
    return await database_1.default.kyc.findMany({
        where: { status: "PENDING" },
        orderBy: { submittedAt: 'asc' }
    });
};
exports.getPendingKYCs = getPendingKYCs;
const checkKYCStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                walletAddress: true,
                kycStatus: true,
                kycSubmittedAt: true,
                kycApprovedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let blockchainVerified = false;
        let blockchainError = null;
        if (user.walletAddress && user.kycStatus === 'APPROVED') {
            try {
                console.log('🔍 Checking blockchain KYC for:', user.walletAddress);
                blockchainVerified = await kyc_1.default.isVerified(user.walletAddress);
                console.log('✅ Blockchain verification result:', blockchainVerified);
            }
            catch (error) {
                console.error(' Blockchain check error:', error.message);
                blockchainError = error.message;
            }
        }
        res.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                walletAddress: user.walletAddress,
                kycStatus: user.kycStatus,
                kycSubmittedAt: user.kycSubmittedAt,
                kycApprovedAt: user.kycApprovedAt,
                blockchain: {
                    verified: blockchainVerified,
                    error: blockchainError,
                    checkedAt: new Date().toISOString()
                }
            }
        });
    }
    catch (error) {
        console.error('Error checking KYC status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check KYC status',
            details: error.message
        });
    }
};
exports.checkKYCStatus = checkKYCStatus;
const getKYCStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const kycRecord = await database_1.default.kyc.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                rejectionReason: true,
                approvedAt: true,
                reviewedAt: true,
                reviewedBy: true,
                blockchainTx: true,
            },
        });
        if (!kycRecord) {
            return res.status(404).json({
                success: false,
                message: "KYC record not found",
            });
        }
        return res.json({
            success: true,
            data: kycRecord,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getKYCStatus = getKYCStatus;
const getKYCStatistics = async (req, res) => {
    try {
        const stats = {
            total: await database_1.default.kyc.count(),
            pending: await database_1.default.kyc.count({ where: { status: "PENDING" } }),
            approved: await database_1.default.kyc.count({ where: { status: "APPROVED" } }),
            rejected: await database_1.default.kyc.count({ where: { status: "REJECTED" } }),
        };
        return res.json({ success: true, data: stats });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getKYCStatistics = getKYCStatistics;
//# sourceMappingURL=kycController.js.map