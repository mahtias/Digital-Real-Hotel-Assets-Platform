// backend/src/services/KYCService.ts

import prisma from '../config/database';
import { KycStatus, UserRole } from '@prisma/client';
import { keccak256 } from "ethers"; 
import { ethers } from "ethers";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import dotenv from "dotenv";
dotenv.config();
// -------------------------
// Types
// -------------------------
interface KYCUpdateData {
  fullName?: string;
  dateOfBirth?: Date;
  nationality?: string;
  address?: string;
  documentType?: string;
  documentNumber?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface SubmitKYCData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  documentType: string;
  documentNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  documentFileBase64: string;
  kycLevel: number;
  documentFront?: string | null;
  documentBack?: string | null;
  selfieImage?: string | null;
  addressProof?: string | null;
}

// -------------------------
// Contract Configuration
// -------------------------
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const kycContract = new ethers.Contract(
  process.env.KYC_CONTRACT_ADDRESS!,
  kycRegistryAbi.abi,
  wallet
);

// -------------------------
// KYC Service Class
// -------------------------
class KYCService {
  
  // --------------------------------------------------
  // 1. SUBMIT KYC (User Action)
  // --------------------------------------------------
  async submitKYC(userId: string, data: SubmitKYCData) {
    try {
      // Validate user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found.');
      if (!user.walletAddress) throw new Error('Wallet address required.');

      // Prevent duplicate submissions
      if (user.kycStatus === KycStatus.PENDING) {
        throw new Error('KYC already submitted and awaiting review.');
      }

      // Validate date
      const dobString = (data.dateOfBirth || "").trim();
      const dob = new Date(dobString);
      if (isNaN(dob.getTime())) {
        throw new Error("Invalid dateOfBirth. Expected ISO: YYYY-MM-DD");
      }

      // Validate document
      if (!data.documentFileBase64) {
        throw new Error("Document file is required.");
      }

      // Hash document
      const buffer = Buffer.from(data.documentFileBase64, "base64");
      const documentHash = keccak256(buffer);

      // Call blockchain
      const txHash = await this.submitKYCOnChain(user.walletAddress, documentHash, data.kycLevel);
if (txHash === "already-submitted") {
  console.log("⚠ KYC already exists on-chain, skipping submission");
}

      // Delete old KYC records
      await prisma.kyc.deleteMany({ where: { userId } });

      // Create new KYC record
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
          blockchainTx: null  // Will be set when admin approves
        }
      });

      // Update user status
      await prisma.user.update({
        where: { id: userId },
        data: {
          kycStatus: KycStatus.PENDING,
          kycSubmittedAt: new Date()
        }
      });

      return kyc;

    } catch (error: any) {
      console.error(' submitKYC error:', error);
      throw error;
    }
  }



async reviewKYC(
  kycId: string,
  reviewData: { status: string; reason?: string },
  adminId: string
) {
  try {
    // Validate KYC exists
    const kyc = await prisma.kyc.findUnique({ 
      where: { id: kycId },
      include: { user: true }
    });
    
    if (!kyc) throw new Error("KYC not found");

    // Validate admin
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized: only admins can review KYC.");
    }

    const validityInSeconds = 365 * 24 * 60 * 60; // 1 year
    const now = new Date();

    // ---------- APPROVE ----------
    if (reviewData.status === KycStatus.APPROVED) {
      const expiresAt = new Date(now.getTime() + validityInSeconds * 1000);

      // 1️⃣ Update DB first
      const updated = await prisma.kyc.update({
        where: { id: kycId },
        data: {
          status: KycStatus.APPROVED,
          rejectionReason: null,
          reviewedBy: adminId,
          reviewedAt: now,
          expiresAt
        }
      });

      await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: KycStatus.APPROVED }
      });

      console.log("✅ Database approval successful");

      // 2️⃣ Attempt blockchain verification
      if (kyc.user.walletAddress) {
        try {
          const txHash = await this.verifyUser(
            kyc.user.walletAddress,
            1,
             kyc.documentHash || undefined
          );

          console.log("🔗 Blockchain verification result:", txHash);

          // 3️⃣ Update KYC record with blockchain result
          await prisma.kyc.update({
            where: { id: kycId },
            data: { blockchainTx: txHash }
          });

        } catch (blockchainError: any) {
          console.error(
            "⚠ Blockchain verification failed, keeping DB approval:",
            blockchainError.message
          );
          // Do not throw, frontend can retry or cron will sync
        }
      }

      return updated;
    }

    // ---------- REJECT ----------
    if (reviewData.status === KycStatus.REJECTED) {
      const reason = reviewData.reason || "Not provided";

      const updated = await prisma.kyc.update({
        where: { id: kycId },
        data: {
          status: KycStatus.REJECTED,
          rejectionReason: reason,
          reviewedBy: adminId,
          reviewedAt: now,
          expiresAt: null,
          blockchainTx: null
        }
      });

      await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycStatus: KycStatus.REJECTED }
      });

      console.log("❌ KYC rejected:", reason);
      return updated;
    }

    throw new Error("Invalid KYC review status");

  } catch (error: any) {
    console.error("reviewKYC error:", error);
    throw error;
  }
}


  // --------------------------------------------------
  // 3. GET KYC RECORDS
  // --------------------------------------------------
  
  async getKYCByUserId(userId: string) {
    return prisma.kyc.findUnique({ 
      where: { userId },
      include: { user: true }
    });
  }

  async getKYCById(id: string) {
    return prisma.kyc.findUnique({ 
      where: { id },
      include: { user: true }
    });
  }

  // --------------------------------------------------
  // 4. PAGINATED LIST (Admin View)
  // --------------------------------------------------
  async getAllKYC(params: {
    status?: KycStatus;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 10 } = params;
    
    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.kyc.count({ where });

    const kycs = await prisma.kyc.findMany({
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

  // --------------------------------------------------
  // 5. BLOCKCHAIN SYNC
  // --------------------------------------------------
  async syncBlockchainStatus(userId: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.walletAddress) throw new Error("User not found");

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

      // Map blockchain status to Prisma enum
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

      // Sync user status
      await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: mapped }
      });

      return updated;

    } catch (error: any) {
      console.error('syncBlockchainStatus error:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // 6. VERIFY KYC ON BLOCKCHAIN (Quick Check)
  // --------------------------------------------------
  async verifyKYCOnBlockchain(walletAddress: string): Promise<boolean> {
    try {
      const record = await kycContract.getKYCRecord(walletAddress);
      return Number(record.status) === 2; // 2 = APPROVED
    } catch (error: any) {
      console.error(' verifyKYCOnBlockchain error:', error);
      return false;
    }
  }

  // --------------------------------------------------
  // 7. GET FULL BLOCKCHAIN RECORD
  // --------------------------------------------------
  async getBlockchainKYCRecord(walletAddress: string) {
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
    } catch (error: any) {
      console.error(' getBlockchainKYCRecord error:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // 8. STATISTICS (Dashboard)
  // --------------------------------------------------
  async getStatistics() {
    const [total, approved, pending, rejected, expired] = await Promise.all([
      prisma.kyc.count(),
      prisma.kyc.count({ where: { status: KycStatus.APPROVED } }),
      prisma.kyc.count({ where: { status: KycStatus.PENDING } }),
      prisma.kyc.count({ where: { status: KycStatus.REJECTED } }),
      prisma.kyc.count({ where: { status: KycStatus.EXPIRED } })
    ]);

    return { total, approved, pending, rejected, expired };
  }

  // --------------------------------------------------
  // 9. UPDATE KYC (Admin Edit)
  // --------------------------------------------------
  async updateKYC(id: string, updateData: KYCUpdateData) {
    try {
      const exists = await prisma.kyc.findUnique({ where: { id } });
      if (!exists) throw new Error("KYC record not found");

      return prisma.kyc.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });
    } catch (error: any) {
      console.error(' updateKYC error:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // 10. DELETE KYC (Admin)
  // --------------------------------------------------
  async deleteKYC(id: string, adminId: string) {
    try {
      // Verify admin
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error("Unauthorized: only admins can delete KYC.");
      }

      return prisma.kyc.delete({ where: { id } });
    } catch (error: any) {
      console.error(' deleteKYC error:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // 11. CHECK EXPIRED KYC (Cron Job)
  // --------------------------------------------------
  async checkAndUpdateExpiredKYC() {
    try {
      const now = new Date();

      const expired = await prisma.kyc.findMany({
        where: {
          expiresAt: { lt: now },
          status: KycStatus.APPROVED // Only mark approved ones as expired
        }
      });

      for (const k of expired) {
        await prisma.kyc.update({
          where: { id: k.id },
          data: { status: KycStatus.EXPIRED }
        });

        // Update user status
        await prisma.user.update({
          where: { id: k.userId },
          data: { kycStatus: KycStatus.EXPIRED }
        });
      }

      console.log(` Marked ${expired.length} KYC records as expired.`);
      return expired.length;

    } catch (error: any) {
      console.error(' checkAndUpdateExpiredKYC error:', error);
      throw error;
    }
  }

   // --------------------------------------------------
  // 12. IS VERIFIED (Check if wallet is verified on blockchain)
  // --------------------------------------------------

  async isVerified(walletAddress: string): Promise<boolean> {
    try {
      return await kycContract.isKYCVerified(walletAddress);
    } catch (error: any) {
      console.error(' isVerified error:', error);
      return false;
    }
  }

   // -------------------------
// Helper: submit KYC on-chain
// -------------------------
async submitKYCOnChain(walletAddress: string, documentHash: string, level: number = 1): Promise<string> {
  try {
    const status = Number(await kycContract.getKYCStatus(walletAddress));
    const PENDING = 1;

    if (status !== 0) {
      console.log("KYC already submitted on-chain or in another state:", status);
      return "already-submitted";
    }

    console.log("🔗 Submitting KYC on-chain...");
    const tx = await kycContract.submitKYC(level, documentHash);
    await tx.wait();

    console.log("✅ KYC submitted on-chain:", tx.hash);
    return tx.hash;
  } catch (error: any) {
    console.error(" submitKYCOnChain error:", error);
    throw new Error(`Blockchain KYC submission failed: ${error.message}`);
  }
}


// -------------------------
// verifyUser
// -------------------------
async verifyUser(walletAddress: string, level: number = 1, documentHash?: string): Promise<string> {
  const PENDING = 1;
  const APPROVED = 2;

  const onChainStatus = Number(await kycContract.getKYCStatus(walletAddress));
  console.log("📊 On-chain status:", onChainStatus);

  // Already approved
  if (onChainStatus === APPROVED) return "already-approved";

  // Already pending
  if (onChainStatus === PENDING) return "already-pending";

  // Only submit if truly not submitted
  if (onChainStatus === 0) {
    if (!documentHash) throw new Error("Document hash required for initial KYC submission");
    try {
      const txHash = await this.submitKYCOnChain(walletAddress, documentHash, level);
      return txHash;
    } catch (err: any) {
      // Smart contract sometimes rejects if KYC exists, handle gracefully
      if (err.message.includes("already pending or approved")) {
        console.warn("⚠ KYC already exists on-chain, skipping submit");
        return "already-on-chain";
      }
      throw err;
    }
  }

  // Approve KYC on-chain
  const validityDuration = 365 * 24 * 60 * 60;
  const approveTx = await kycContract.approveKYC(walletAddress, level, validityDuration);
  await approveTx.wait();
  return approveTx.hash;
}



}

 
  


export default new KYCService();
