// backend/src/services/KYCService.ts

import prisma from '../config/database';
import { KycStatus, UserRole } from '@prisma/client';
import { keccak256 } from "ethers"; 
import { ethers } from "ethers";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";

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
      let tx;
      try {
        tx = await kycContract.submitKYC(data.kycLevel, documentHash);
        await tx.wait();
      } catch (blockchainError: any) {
        console.error(' Blockchain submission failed:', blockchainError);
        throw new Error(`Blockchain error: ${blockchainError.message}`);
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
    let tx;

    // ---------- APPROVE ----------
    // if (reviewData.status === KycStatus.APPROVED) {
      
    //   // Check if user has wallet
    //   if (kyc.user.walletAddress) {
    //     console.log('User has wallet, approving on blockchain...');
    //     try {
    //      const txHash = await kycContract.verifyUser(kyc.user.walletAddress);
    //     console.log('✅ Blockchain approval tx:', txHash);
    //       console.log('Blockchain approval successful');
    //     } catch (blockchainError: any) {
    //       console.error(' Blockchain approval failed:', blockchainError);
    //       throw new Error(`Blockchain approval error: ${blockchainError.message}`);
    //     }
    //   } else {
    //     console.log(' User has no wallet yet - will sync when wallet connects');
    //   }
    // }
    if (reviewData.status === KycStatus.APPROVED) {

  // ✅ Update DB FIRST (no blockchain dependency)
  const expiresAt = new Date(Date.now() + validityInSeconds * 1000);

  const updated = await prisma.kyc.update({
    where: { id: kycId },
    data: {
      status: KycStatus.APPROVED,
      rejectionReason: null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      expiresAt
    }
  });


  await prisma.user.update({
    where: { id: kyc.userId },
    data: { kycStatus: KycStatus.APPROVED }
  });

  console.log("✅ Database approval successful");

  // ✅ Try blockchain AFTER DB update
  if (kyc.user.walletAddress) {
    try {
      const txHash = await kycContract.verifyUser(kyc.user.walletAddress);
      console.log("✅ Blockchain approval tx:", txHash);

      await prisma.kyc.update({
        where: { id: kycId },
        data: { blockchainTx: txHash }
      });

    } catch (blockchainError: any) {
      console.error("⚠ Blockchain failed but admin approval kept:", blockchainError.message);
      // DO NOT THROW
    }
  }

  return updated;
}
    // ---------- REJECT ----------
    if (reviewData.status === KycStatus.REJECTED) {
      const reason = reviewData.reason || "Not provided";
      
      // Only reject on blockchain if user has wallet
      if (kyc.user.walletAddress) {
        try {
          console.log('⚠️  Rejection not yet implemented on blockchain');
        } catch (blockchainError: any) {
          console.error(' Blockchain rejection failed:', blockchainError);
          throw new Error(`Blockchain rejection error: ${blockchainError.message}`);
        }
      }
    }
    // Calculate expiry for approved KYC
    const expiresAt = reviewData.status === KycStatus.APPROVED 
      ? new Date(Date.now() + validityInSeconds * 1000) 
      : null;

    // Update KYC record
    let blockchainTxHash: string | null = null;
    const updated = await prisma.kyc.update({
      where: { id: kycId },
      data: {
        status: reviewData.status as KycStatus,
        rejectionReason: reviewData.reason || null,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        expiresAt,
        blockchainTx: blockchainTxHash  
      }
    });

    // Sync user.kycStatus
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: reviewData.status as KycStatus }
    });

    return updated;

  } catch (error: any) {
    console.error(' reviewKYC error:', error);
    throw error;
  }
};
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

  // --------------------------------------------------
  // 13. VERIFY USER (Admin manually verifies on blockchain)
  // --------------------------------------------------
//   async verifyUser(walletAddress: string, level: number = 1): Promise<string> {
//   try {
//     console.log("Available contract functions:", Object.keys(kycContract));
//     const tx = await kycContract.verifyUser(walletAddress, level);
//     await tx.wait();
//     console.log('✅ User verified on blockchain:', walletAddress);
//     return tx.hash; // ← ADD THIS LINE
//   } catch (error: any) {
//     console.error('❌ verifyUser error:', error);
//     throw new Error(`Blockchain verification failed: ${error.message}`);
//   }
// }
async verifyUser(walletAddress: string, level: number = 1): Promise<string> {
  try {
    console.log("🔗 Approving user on blockchain...");

    const status = Number(await kycContract.getKYCStatus(walletAddress));
    console.log("📊 On-chain status:", status);

    const PENDING = 1;
    const APPROVED = 2;

    if (status === APPROVED) {
      console.log("Already approved on-chain");
      return "already-approved";
    }

    if (status !== PENDING) {
      throw new Error("User has not submitted KYC on-chain");
    }

    const validityDuration = 365 * 24 * 60 * 60; // 1 year

    const approveTx = await kycContract.approveKYC(
      walletAddress,
      level,
      validityDuration
    );

    await approveTx.wait();

    console.log("✅ approveKYC successful");
    return approveTx.hash;

  } catch (error: any) {
    console.error("❌ Blockchain verification failed:", error);
    throw new Error(`Blockchain verification failed: ${error.message}`);
  }
}



}

 
  


export default new KYCService();
