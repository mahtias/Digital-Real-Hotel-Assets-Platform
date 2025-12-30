"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const client_1 = require("@prisma/client");
const ethers_1 = require("ethers");
const ethers_2 = require("ethers");
const KYCRegistry_json_1 = __importDefault(require("../../../out/KYCRegistry.sol/KYCRegistry.json"));
const provider = new ethers_2.ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers_2.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const kycContract = new ethers_2.ethers.Contract(process.env.KYC_CONTRACT_ADDRESS, KYCRegistry_json_1.default.abi, wallet);
class KYCService {
    async submitKYC(userId, data) {
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found.');
        if (user.kycStatus === client_1.KycStatus.PENDING) {
            throw new Error('KYC already submitted and awaiting review.');
        }
        const dobString = (data.dateOfBirth || "").trim();
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) {
            throw new Error("Invalid dateOfBirth. Expected ISO: YYYY-MM-DD");
        }
        if (!data.documentFileBase64) {
            throw new Error("Document file is required.");
        }
        const buffer = Buffer.from(data.documentFileBase64, "base64");
        const documentHash = (0, ethers_1.keccak256)(buffer);
        const tx = await kycContract.submitKYC(data.kycLevel, documentHash);
        await tx.wait();
        await database_1.default.kyc.deleteMany({ where: { userId } });
        const kyc = await database_1.default.kyc.create({
            data: {
                userId,
                fullName: data.fullName,
                dateOfBirth: dob,
                nationality: data.nationality,
                address: data.address,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
                documentHash,
                status: client_1.KycStatus.PENDING,
                blockchainTx: tx.hash
            }
        });
        await database_1.default.user.update({
            where: { id: userId },
            data: {
                kycStatus: client_1.KycStatus.PENDING,
                kycSubmittedAt: new Date()
            }
        });
        return kyc;
    }
    async approveKYC(adminId, userId, validitySeconds) {
        const admin = await database_1.default.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== "ADMIN")
            throw new Error("Unauthorized");
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.walletAddress)
            throw new Error("User walletAddress missing");
        const tx = await kycContract.approveKYC(user.walletAddress, validitySeconds);
        await tx.wait();
        const expiresAt = new Date(Date.now() + validitySeconds * 1000);
        const updated = await database_1.default.kyc.update({
            where: { userId },
            data: {
                status: client_1.KycStatus.APPROVED,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                expiresAt,
                blockchainTx: tx.hash
            }
        });
        await database_1.default.user.update({
            where: { id: userId },
            data: {
                kycStatus: client_1.KycStatus.APPROVED
            }
        });
        return updated;
    }
    async reviewKYC(id, reviewData, adminId) {
        const kyc = await database_1.default.kyc.findUnique({ where: { id } });
        if (!kyc)
            throw new Error("KYC not found");
        const admin = await database_1.default.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== "ADMIN") {
            throw new Error("Unauthorized: only admins can review KYC.");
        }
        const user = await database_1.default.user.findUnique({ where: { id: kyc.userId } });
        if (!user || !user.walletAddress) {
            throw new Error("User walletAddress missing for on-chain validation.");
        }
        let tx;
        if (reviewData.status === "APPROVED") {
            tx = await kycContract.approveKYC(user.walletAddress, 365 * 24 * 60 * 60);
            await tx.wait();
        }
        if (reviewData.status === "REJECTED") {
            const reason = reviewData.reason || "Not provided";
            tx = await kycContract.rejectKYC(user.walletAddress, reason);
            await tx.wait();
        }
        const updated = await database_1.default.kyc.update({
            where: { id },
            data: {
                status: reviewData.status,
                rejectionReason: reviewData.reason || null,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                blockchainTx: tx ? tx.hash : null
            }
        });
        await database_1.default.user.update({
            where: { id: kyc.userId },
            data: { kycStatus: reviewData.status }
        });
        return updated;
    }
    async rejectKYC(adminId, userId, reason) {
        const admin = await database_1.default.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== "ADMIN")
            throw new Error("Unauthorized");
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.walletAddress)
            throw new Error("User walletAddress missing");
        const tx = await kycContract.rejectKYC(user.walletAddress, reason);
        await tx.wait();
        const updated = await database_1.default.kyc.update({
            where: { userId },
            data: {
                status: client_1.KycStatus.REJECTED,
                rejectionReason: reason,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                blockchainTx: tx.hash
            }
        });
        await database_1.default.user.update({
            where: { id: userId },
            data: { kycStatus: client_1.KycStatus.REJECTED }
        });
        return updated;
    }
    async getKYCByUserId(userId) {
        return database_1.default.kyc.findUnique({ where: { userId } });
    }
    async getKYCById(id) {
        return database_1.default.kyc.findUnique({ where: { id } });
    }
    async getAllKYC(params) {
        const { status, page, limit } = params;
        const where = {};
        if (status)
            where.status = status;
        const total = await database_1.default.kyc.count({ where });
        const kycs = await database_1.default.kyc.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: true }
        });
        return { kycs, total, page, limit };
    }
    async syncBlockchainStatus(userId) {
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.walletAddress)
            throw new Error("User not found");
        const record = await kycContract.getKYCRecord(user.walletAddress);
        const onchain = {
            level: Number(record.level),
            status: Number(record.status),
            approvedAt: record.approvedAt ? new Date(record.approvedAt * 1000) : null,
            expiresAt: record.expiresAt ? new Date(record.expiresAt * 1000) : null,
            documentHash: record.documentHash,
            verifiedBy: record.verifiedBy,
            rejectionReason: record.rejectionReason || null
        };
        let mapped = client_1.KycStatus.NOT_STARTED;
        if (onchain.status === 1)
            mapped = client_1.KycStatus.PENDING;
        if (onchain.status === 2)
            mapped = client_1.KycStatus.APPROVED;
        if (onchain.status === 3)
            mapped = client_1.KycStatus.REJECTED;
        if (onchain.status === 4)
            mapped = client_1.KycStatus.EXPIRED;
        const updated = await database_1.default.kyc.update({
            where: { userId },
            data: {
                status: mapped,
                expiresAt: onchain.expiresAt,
                approvedAt: onchain.approvedAt,
                documentHash: onchain.documentHash,
                rejectionReason: onchain.rejectionReason
            }
        });
        return updated;
    }
    async getStatistics() {
        const total = await database_1.default.kyc.count();
        const approved = await database_1.default.kyc.count({ where: { status: client_1.KycStatus.APPROVED } });
        const pending = await database_1.default.kyc.count({ where: { status: client_1.KycStatus.PENDING } });
        const rejected = await database_1.default.kyc.count({ where: { status: client_1.KycStatus.REJECTED } });
        return { total, approved, pending, rejected };
    }
    async updateKYC(id, data, updateData) {
        const exists = await database_1.default.kyc.findUnique({ where: { id } });
        if (!exists)
            throw new Error("KYC record not found");
        return database_1.default.kyc.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }
    async deleteKYC(id, userId, role) {
        return database_1.default.kyc.delete({ where: { id } });
    }
    async verifyKYCOnBlockchain(walletAddress) {
        const record = await kycContract.getKYCRecord(walletAddress);
        return Number(record.status) === 2;
    }
    async getBlockchainKYCRecord(walletAddress) {
        const record = await kycContract.getKYCRecord(walletAddress);
        return {
            level: Number(record.level),
            status: Number(record.status),
            approvedAt: record.approvedAt ? new Date(record.approvedAt * 1000) : null,
            expiresAt: record.expiresAt ? new Date(record.expiresAt * 1000) : null,
            documentHash: record.documentHash,
            verifiedBy: record.verifiedBy,
            rejectionReason: record.rejectionReason
        };
    }
    async checkAndUpdateExpiredKYC() {
        const now = new Date();
        const expired = await database_1.default.kyc.findMany({
            where: {
                expiresAt: { lt: now },
                status: { not: client_1.KycStatus.EXPIRED }
            }
        });
        for (const k of expired) {
            await database_1.default.kyc.update({
                where: { id: k.id },
                data: { status: client_1.KycStatus.EXPIRED }
            });
        }
        return expired.length;
    }
}
exports.default = new KYCService();
//# sourceMappingURL=KYCService.js.map