import prisma from '../config/database';
import { KycStatus, UserRole } from '@prisma/client';
import { keccak256 } from "ethers"; 
import { ethers } from "ethers";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import { KYCUpdateData } from '@/types/kyc.types';

// -------------------------
// Contract configuration
// -------------------------
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const kycContract = new ethers.Contract(
  process.env.KYC_CONTRACT_ADDRESS!,
  kycRegistryAbi.abi,
  wallet
);

class KYCService {
  // --------------------------------------------------
  // Submit KYC → Hash Docs → Store in DB → Call Contract
  // --------------------------------------------------
  async submitKYC(userId: string, data: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found.');

    if (user.kycStatus === KycStatus.PENDING) {
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
    const documentHash = keccak256(buffer);

    const tx = await kycContract.submitKYC(data.kycLevel, documentHash);
    await tx.wait();

    await prisma.kyc.deleteMany({ where: { userId } });

    const kyc = await prisma.kyc.create({
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
        status: KycStatus.PENDING,
        blockchainTx: tx.hash
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: KycStatus.PENDING,
        kycSubmittedAt: new Date()
      }
    });

    return kyc;
  }

  // --------------------------------------------------
  // Admin Approve KYC
  // --------------------------------------------------
  async approveKYC(adminId: string, userId: string, validitySeconds: number) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== "ADMIN")
      throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.walletAddress)
      throw new Error("User walletAddress missing");

    const tx = await kycContract.approveKYC(user.walletAddress, validitySeconds);
    await tx.wait();

    const expiresAt = new Date(Date.now() + validitySeconds * 1000);

    const updated = await prisma.kyc.update({
      where: { userId },
      data: {
        status: KycStatus.APPROVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        expiresAt,
        blockchainTx: tx.hash
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: KycStatus.APPROVED
      }
    });

    return updated;
  }

  async reviewKYC(
  id: string,
  reviewData: { status: string; reason?: string },
  adminId: string
) {
  const kyc = await prisma.kyc.findUnique({ where: { id } });
  if (!kyc) throw new Error("KYC not found");

  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized: only admins can review KYC.");
  }

  const user = await prisma.user.findUnique({ where: { id: kyc.userId } });
  if (!user || !user.walletAddress) {
    throw new Error("User walletAddress missing for on-chain validation.");
  }

  let tx;

  // ---------- APPROVE ----------
  if (reviewData.status === "APPROVED") {
    tx = await kycContract.approveKYC(
      user.walletAddress,
      365 * 24 * 60 * 60 // 1 year validity
    );
    await tx.wait();
  }

  // ---------- REJECT ----------
  if (reviewData.status === "REJECTED") {
    const reason = reviewData.reason || "Not provided";
    tx = await kycContract.rejectKYC(user.walletAddress, reason);
    await tx.wait();
  }

  // ---------- Update DB ----------
  const updated = await prisma.kyc.update({
    where: { id },
    data: {
      status: reviewData.status as KycStatus,
      rejectionReason: reviewData.reason || null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      blockchainTx: tx ? tx.hash : null
    }
  });

  // Sync user.kycStatus
  await prisma.user.update({
    where: { id: kyc.userId },
    data: { kycStatus: reviewData.status as KycStatus }
  });

  return updated;
}


  // --------------------------------------------------
  // Reject KYC
  // --------------------------------------------------
  async rejectKYC(adminId: string, userId: string, reason: string) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== "ADMIN")
      throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.walletAddress)
      throw new Error("User walletAddress missing");

    const tx = await kycContract.rejectKYC(user.walletAddress, reason);
    await tx.wait();

    const updated = await prisma.kyc.update({
      where: { userId },
      data: {
        status: KycStatus.REJECTED,
        rejectionReason: reason,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        blockchainTx: tx.hash
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: KycStatus.REJECTED }
    });

    return updated;
  }

  // --------------------------------------------------
  // Get KYC Records
  // --------------------------------------------------
  async getKYCByUserId(userId: string) {
    return prisma.kyc.findUnique({ where: { userId } });
  }

  async getKYCById(id: string) {
    return prisma.kyc.findUnique({ where: { id } });
  }

  // --------------------------------------------------
  // Paginated List
  // --------------------------------------------------
  async getAllKYC(params: any) {
    const { status, page, limit } = params;
    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.kyc.count({ where });

    const kycs = await prisma.kyc.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });

    return { kycs, total, page, limit };
  }

  // --------------------------------------------------
  // Sync On-chain Status
  // --------------------------------------------------
  async syncBlockchainStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.walletAddress) throw new Error("User not found");

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

    let mapped: KycStatus = KycStatus.NOT_STARTED;

    if (onchain.status === 1) mapped = KycStatus.PENDING;
    if (onchain.status === 2) mapped = KycStatus.APPROVED;
    if (onchain.status === 3) mapped = KycStatus.REJECTED;
    if (onchain.status === 4) mapped = KycStatus.EXPIRED;

    const updated = await prisma.kyc.update({
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

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  async getStatistics() {
    const total = await prisma.kyc.count();
    const approved = await prisma.kyc.count({ where: { status: KycStatus.APPROVED } });
    const pending = await prisma.kyc.count({ where: { status: KycStatus.PENDING } });
    const rejected = await prisma.kyc.count({ where: { status: KycStatus.REJECTED } });

    return { total, approved, pending, rejected };
  }

  // --------------------------------------------------
  // MISSING METHODS (Added Now)
  // --------------------------------------------------

  // Update existing KYC
  async updateKYC(id: string, data: any, updateData: KYCUpdateData) {
    const exists = await prisma.kyc.findUnique({ where: { id } });
    if (!exists) throw new Error("KYC record not found");

    return prisma.kyc.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  // Delete KYC
  async deleteKYC(id: string, userId?: string, role?: string) {
    return prisma.kyc.delete({ where: { id } });
  }

  // Check if user is approved on-chain
  async verifyKYCOnBlockchain(walletAddress: string) {
    const record = await kycContract.getKYCRecord(walletAddress);
    return Number(record.status) === 2;
  }

  // Get full on-chain KYC record
  async getBlockchainKYCRecord(walletAddress: string) {
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

  // Find & mark expired KYC in DB
  async checkAndUpdateExpiredKYC() {
    const now = new Date();

    const expired = await prisma.kyc.findMany({
      where: {
        expiresAt: { lt: now },
        status: { not: KycStatus.EXPIRED }
      }
    });

    for (const k of expired) {
      await prisma.kyc.update({
        where: { id: k.id },
        data: { status: KycStatus.EXPIRED }
      });
    }

    return expired.length;
  }
}

export default new KYCService();
