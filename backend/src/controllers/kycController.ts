import { Request, Response } from 'express';
import prisma from '../config/database';
import fs from 'fs';
import path from 'path';
import { sendAdminKycEmail } from "../utils/sendAdminKycEmail";
import kyc from '../blockchain/kyc'; 

const uploadDir = path.join(__dirname, '../../uploads/kyc');

const deleteFile = (fileName?: string | null) => {
  if (!fileName) return;
  const filePath = path.join(uploadDir, fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// SUBMIT KYC
export const submitKYC = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const files: any = req.files;

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

    const kycRecord = await prisma.kyc.create({
      data,
    });

    // Update user's kycSubmittedAt
    await prisma.user.update({
      where: { id: userId },
      data: { kycSubmittedAt: new Date() }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    // Notify admin
    if (user) sendAdminKycEmail(user);

    return res.json({ success: true, data: kycRecord });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET KYC BY ID
export const getKYCById = async (req: Request, res: Response) => {
  try {
    const kycRecord = await prisma.kyc.findUnique({
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

    if (!kycRecord) return res.status(404).json({ success: false, message: 'KYC not found' });

    return res.json({ success: true, data: kycRecord });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL KYC (ADMIN)
export const getAllKYC = async (req: Request, res: Response) => {
  try {
    const list = await prisma.kyc.findMany({
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

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Fully ready REVIEW KYC (ADMIN) with blockchain verification
export const reviewKYC = async (req: Request, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    const kycId = req.params.id;

    console.log('🔍 Starting KYC review process...');
    console.log('📋 KYC ID:', kycId);
    console.log('📊 New Status:', status);

    // Fetch KYC record and associated user
    const kycRecord = await prisma.kyc.findUnique({
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

    // Base update object
    const data: any = {
      status,
      reviewedAt: new Date(),
      // Uncomment if you add `reviewedBy` column later
      // reviewedBy: req.user?.userId
    };

    // -----------------------------
    // Handle REJECTION
    // -----------------------------
    if (status === "REJECTED") {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required'
        });
      }

      data.rejectionReason = rejectionReason;

      const updated = await prisma.kyc.update({
        where: { id: kycId },
        data
      });

      await prisma.user.update({
        where: { id: updated.userId },
        data: { kycStatus: "REJECTED" }
      });

      console.log('❌ KYC Rejected');
      return res.json({
        success: true,
        data: updated,
        message: 'KYC rejected successfully'
      });
    }

    // -----------------------------
    // Handle APPROVAL
    // -----------------------------
    if (status === "APPROVED") {
      if (!kycRecord.user.walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'User wallet address not found. Cannot verify on blockchain.'
        });
      }

      console.log('🔗 Verifying user on blockchain...');
      let txHash: string;

      try {
        txHash = await kyc.verifyUser(kycRecord.user.walletAddress);

        console.log('✅ Blockchain verification result:', txHash);

        // Handle already-approved case
        if (txHash === "already-approved") {
          console.log(' User already approved on-chain');
          let txHash: string | null;
        }

        data.rejectionReason = null;
        data.approvedAt = new Date();
        data.blockchainTx = txHash;
      } catch (blockchainError: any) {
        console.error(' Blockchain verification failed:', blockchainError.message);
        return res.status(500).json({
          success: false,
          message: 'Blockchain verification failed',
          error: blockchainError.message
        });
      }

      const updated = await prisma.kyc.update({
        where: { id: kycId },
        data
      });

      await prisma.user.update({
        where: { id: updated.userId },
        data: {
          kycStatus: "APPROVED",
          kycApprovedAt: new Date()
        }
      });

      console.log('💾 Database updated for approved KYC');

      return res.json({
        success: true,
        data: {
          ...updated,
          blockchainTx: txHash
        },
        message: 'KYC approved and verified on blockchain',
        txHash: txHash
      });
    }

    // -----------------------------
    // Invalid status
    // -----------------------------
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });

  } catch (error: any) {
    console.error('❌ Review KYC error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// UPDATE KYC (RESUBMIT)
export const updateKYC = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.kyc.findUnique({
      where: { id: req.params.id }
    });

    if (!existing)
      return res.status(404).json({ success: false, message: 'KYC not found' });

    const files = req.files as any;

    const updatedData: any = {
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

    const updated = await prisma.kyc.update({
      where: { id: existing.id },
      data: updatedData
    });

    return res.json({ success: true, data: updated });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE KYC
export const deleteKYC = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.kyc.findUnique({
      where: { id: req.params.id }
    });

    if (!existing)
      return res.status(404).json({ success: false, message: 'KYC not found' });

    deleteFile(existing.documentFront);
    deleteFile(existing.documentBack);
    deleteFile(existing.selfieImage);
    deleteFile(existing.addressProof);

    await prisma.kyc.delete({ where: { id: existing.id } });

    return res.json({ success: true, message: 'KYC deleted successfully' });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PENDING KYC
export const getPendingKYCs = async () => {
  return await prisma.kyc.findMany({
    where: { status: "PENDING" },
    orderBy: { submittedAt: 'asc' }
  });
};

// ✅ GET KYC STATUS (FOR FRONTEND) - NEW FUNCTION
export const checkKYCStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
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

    // Check blockchain verification
    let blockchainVerified = false;
    let blockchainError = null;

    if (user.walletAddress && user.kycStatus === 'APPROVED') {
      try {
        console.log('🔍 Checking blockchain KYC for:', user.walletAddress);
        blockchainVerified = await kyc.isVerified(user.walletAddress);
        console.log('✅ Blockchain verification result:', blockchainVerified);
      } catch (error: any) {
        console.error('❌ Blockchain check error:', error.message);
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

  } catch (error: any) {
    console.error('Error checking KYC status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check KYC status',
      details: error.message
    });
  }
};

// GET KYC STATUS BY ID
export const getKYCStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const kycRecord = await prisma.kyc.findUnique({
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

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// STATISTICS
export const getKYCStatistics = async (req: Request, res: Response) => {
  try {
    const stats = {
      total: await prisma.kyc.count(),
      pending: await prisma.kyc.count({ where: { status: "PENDING" } }),
      approved: await prisma.kyc.count({ where: { status: "APPROVED" } }),
      rejected: await prisma.kyc.count({ where: { status: "REJECTED" } }),
    };

    return res.json({ success: true, data: stats });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
