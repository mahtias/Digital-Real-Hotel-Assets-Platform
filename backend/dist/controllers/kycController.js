"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKYCStatistics = exports.getKYCStatus = exports.getPendingKYCs = exports.deleteKYC = exports.updateKYC = exports.reviewKYC = exports.getAllKYC = exports.getKYCById = exports.submitKYC = void 0;
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
        const kyc = await database_1.default.kyc.create({
            data,
        });
        return res.json({ success: true, data: kyc });
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
        const kyc = await database_1.default.kyc.findUnique({
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
        if (!kyc)
            return res.status(404).json({ success: false, message: 'KYC not found' });
        return res.json({ success: true, data: kyc });
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
                        walletAddress: true
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
        const data = {
            status,
            reviewedAt: new Date(),
            reviewedBy: req.user?.userId
        };
        if (status === 'REJECTED') {
            data.rejectionReason = rejectionReason;
        }
        else {
            data.rejectionReason = null;
            data.approvedAt = new Date();
        }
        const updated = await database_1.default.kyc.update({
            where: { id: req.params.id },
            data
        });
        return res.json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
const getKYCStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const kyc = await database_1.default.kyc.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                rejectionReason: true,
                approvedAt: true,
                reviewedAt: true,
                reviewedBy: true,
            },
        });
        if (!kyc) {
            return res.status(404).json({
                success: false,
                message: "KYC record not found",
            });
        }
        return res.json({
            success: true,
            data: kyc,
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