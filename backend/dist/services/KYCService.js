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
        try {
            const user = await database_1.default.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error('User not found.');
            if (!user.walletAddress)
                throw new Error('Wallet address required.');
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
            let tx;
            try {
                tx = await kycContract.submitKYC(data.kycLevel, documentHash);
                await tx.wait();
            }
            catch (blockchainError) {
                console.error(' Blockchain submission failed:', blockchainError);
                throw new Error(`Blockchain error: ${blockchainError.message}`);
            }
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
        catch (error) {
            console.error(' submitKYC error:', error);
            throw error;
        }
    }
    async reviewKYC(kycId, reviewData, adminId) {
        try {
            const kyc = await database_1.default.kyc.findUnique({
                where: { id: kycId },
                include: { user: true }
            });
            if (!kyc)
                throw new Error("KYC not found");
            const admin = await database_1.default.user.findUnique({ where: { id: adminId } });
            if (!admin || admin.role !== client_1.UserRole.ADMIN) {
                throw new Error("Unauthorized: only admins can review KYC.");
            }
            const validityInSeconds = 365 * 24 * 60 * 60;
            let tx;
            if (reviewData.status === client_1.KycStatus.APPROVED) {
                if (kyc.user.walletAddress) {
                    console.log('User has wallet, approving on blockchain...');
                    try {
                        tx = await kycContract.approveKYC(kyc.user.walletAddress, validityInSeconds);
                        await tx.wait();
                        console.log('Blockchain approval successful');
                    }
                    catch (blockchainError) {
                        console.error(' Blockchain approval failed:', blockchainError);
                        throw new Error(`Blockchain approval error: ${blockchainError.message}`);
                    }
                }
                else {
                    console.log(' User has no wallet yet - will sync when wallet connects');
                }
            }
            if (reviewData.status === client_1.KycStatus.REJECTED) {
                const reason = reviewData.reason || "Not provided";
                if (kyc.user.walletAddress) {
                    try {
                        tx = await kycContract.rejectKYC(kyc.user.walletAddress, reason);
                        await tx.wait();
                    }
                    catch (blockchainError) {
                        console.error(' Blockchain rejection failed:', blockchainError);
                        throw new Error(`Blockchain rejection error: ${blockchainError.message}`);
                    }
                }
            }
            const expiresAt = reviewData.status === client_1.KycStatus.APPROVED
                ? new Date(Date.now() + validityInSeconds * 1000)
                : null;
            const updated = await database_1.default.kyc.update({
                where: { id: kycId },
                data: {
                    status: reviewData.status,
                    rejectionReason: reviewData.reason || null,
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                    expiresAt,
                    blockchainTx: tx ? tx.hash : null
                }
            });
            await database_1.default.user.update({
                where: { id: kyc.userId },
                data: { kycStatus: reviewData.status }
            });
            return updated;
        }
        catch (error) {
            console.error(' reviewKYC error:', error);
            throw error;
        }
    }
    ;
    async getKYCByUserId(userId) {
        return database_1.default.kyc.findUnique({
            where: { userId },
            include: { user: true }
        });
    }
    async getKYCById(id) {
        return database_1.default.kyc.findUnique({
            where: { id },
            include: { user: true }
        });
    }
    async getAllKYC(params) {
        const { status, page = 1, limit = 10 } = params;
        const where = {};
        if (status)
            where.status = status;
        const total = await database_1.default.kyc.count({ where });
        const kycs = await database_1.default.kyc.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        walletAddress: true,
                        role: true
                    }
                }
            }
        });
        return {
            kycs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async syncBlockchainStatus(userId) {
        try {
            const user = await database_1.default.user.findUnique({ where: { id: userId } });
            if (!user || !user.walletAddress)
                throw new Error("User not found");
            const record = await kycContract.getKYCRecord(user.walletAddress);
            const onchain = {
                level: Number(record.level),
                status: Number(record.status),
                approvedAt: record.approvedAt ? new Date(Number(record.approvedAt) * 1000) : null,
                expiresAt: record.expiresAt ? new Date(Number(record.expiresAt) * 1000) : null,
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
            await database_1.default.user.update({
                where: { id: userId },
                data: { kycStatus: mapped }
            });
            return updated;
        }
        catch (error) {
            console.error('syncBlockchainStatus error:', error);
            throw error;
        }
    }
    async verifyKYCOnBlockchain(walletAddress) {
        try {
            const record = await kycContract.getKYCRecord(walletAddress);
            return Number(record.status) === 2;
        }
        catch (error) {
            console.error(' verifyKYCOnBlockchain error:', error);
            return false;
        }
    }
    async getBlockchainKYCRecord(walletAddress) {
        try {
            const record = await kycContract.getKYCRecord(walletAddress);
            return {
                level: Number(record.level),
                status: Number(record.status),
                approvedAt: record.approvedAt ? new Date(Number(record.approvedAt) * 1000) : null,
                expiresAt: record.expiresAt ? new Date(Number(record.expiresAt) * 1000) : null,
                documentHash: record.documentHash,
                verifiedBy: record.verifiedBy,
                rejectionReason: record.rejectionReason
            };
        }
        catch (error) {
            console.error(' getBlockchainKYCRecord error:', error);
            throw error;
        }
    }
    async getStatistics() {
        const [total, approved, pending, rejected, expired] = await Promise.all([
            database_1.default.kyc.count(),
            database_1.default.kyc.count({ where: { status: client_1.KycStatus.APPROVED } }),
            database_1.default.kyc.count({ where: { status: client_1.KycStatus.PENDING } }),
            database_1.default.kyc.count({ where: { status: client_1.KycStatus.REJECTED } }),
            database_1.default.kyc.count({ where: { status: client_1.KycStatus.EXPIRED } })
        ]);
        return { total, approved, pending, rejected, expired };
    }
    async updateKYC(id, updateData) {
        try {
            const exists = await database_1.default.kyc.findUnique({ where: { id } });
            if (!exists)
                throw new Error("KYC record not found");
            return database_1.default.kyc.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                }
            });
        }
        catch (error) {
            console.error(' updateKYC error:', error);
            throw error;
        }
    }
    async deleteKYC(id, adminId) {
        try {
            const admin = await database_1.default.user.findUnique({ where: { id: adminId } });
            if (!admin || admin.role !== client_1.UserRole.ADMIN) {
                throw new Error("Unauthorized: only admins can delete KYC.");
            }
            return database_1.default.kyc.delete({ where: { id } });
        }
        catch (error) {
            console.error(' deleteKYC error:', error);
            throw error;
        }
    }
    async checkAndUpdateExpiredKYC() {
        try {
            const now = new Date();
            const expired = await database_1.default.kyc.findMany({
                where: {
                    expiresAt: { lt: now },
                    status: client_1.KycStatus.APPROVED
                }
            });
            for (const k of expired) {
                await database_1.default.kyc.update({
                    where: { id: k.id },
                    data: { status: client_1.KycStatus.EXPIRED }
                });
                await database_1.default.user.update({
                    where: { id: k.userId },
                    data: { kycStatus: client_1.KycStatus.EXPIRED }
                });
            }
            console.log(` Marked ${expired.length} KYC records as expired.`);
            return expired.length;
        }
        catch (error) {
            console.error(' checkAndUpdateExpiredKYC error:', error);
            throw error;
        }
    }
    async isVerified(walletAddress) {
        try {
            return await kycContract.isVerified(walletAddress);
        }
        catch (error) {
            console.error(' isVerified error:', error);
            return false;
        }
    }
    async verifyUser(walletAddress, level = 1) {
        try {
            const tx = await kycContract.verifyUser(walletAddress, level);
            await tx.wait();
            console.log('✅ User verified on blockchain:', walletAddress);
            return tx.hash;
        }
        catch (error) {
            console.error('❌ verifyUser error:', error);
            throw new Error(`Blockchain verification failed: ${error.message}`);
        }
    }
}
exports.default = new KYCService();
//# sourceMappingURL=KYCService.js.map