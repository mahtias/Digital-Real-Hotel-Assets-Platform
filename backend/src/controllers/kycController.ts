import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../../uploads/kyc');

const deleteFile = (fileName?: string | null) => {
  if (!fileName) return;
  const filePath = path.join(uploadDir, fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// ==================================================
// SUBMIT KYC
// ==================================================
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

    const kyc = await prisma.kyc.create({
      data,
    });

    return res.json({ success: true, data: kyc });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================================================
// GET KYC BY ID
// ==================================================
export const getKYCById = async (req: Request, res: Response) => {
  try {
    const kyc = await prisma.kyc.findUnique({
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

    if (!kyc) return res.status(404).json({ success: false, message: 'KYC not found' });

    return res.json({ success: true, data: kyc });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// GET ALL KYC (ADMIN)
// ==================================================
export const getAllKYC = async (req: Request, res: Response) => {
  try {
    const list = await prisma.kyc.findMany({
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

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// REVIEW KYC (ADMIN)
// ==================================================
export const reviewKYC = async (req: Request, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;

    const data: any = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user?.userId
    };

    if (status === 'REJECTED') {
      data.rejectionReason = rejectionReason;
    } else {
      data.rejectionReason = null;
      data.approvedAt = new Date();
    }

    const updated = await prisma.kyc.update({
      where: { id: req.params.id },
      data
    });

    return res.json({ success: true, data: updated });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================================================
// UPDATE KYC (RESUBMIT)
// ==================================================
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

// ==================================================
// DELETE KYC
// ==================================================
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

// ==================================================
// PENDING KYC
// ==================================================
export const getPendingKYCs = async () => {
  return await prisma.kyc.findMany({
    where: { status: "PENDING" },
    orderBy: { submittedAt: 'asc' }
  });
};

export const getKYCStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const kyc = await prisma.kyc.findUnique({
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

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==================================================
// STATISTICS
// ==================================================
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
