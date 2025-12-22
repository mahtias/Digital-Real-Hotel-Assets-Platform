import { KYC } from '../models/KYC';
import { User } from '../models/User';
import {
  KYCStatus,
  VerificationLevel,
  KYCSubmissionData,
  KYCReviewData,
  KYCUpdateData,
} from '../types/kyc.types';
import { UserRole } from '../models/User';
import { Op } from 'sequelize';

export class KYCService {
  // Submit new KYC
  static async submitKYC(data: KYCSubmissionData): Promise<KYC> {
    // Check if user already has a KYC
    const existingKYC = await KYC.findOne({
      where: { userId: data.userId },
    });

    if (existingKYC) {
      throw new Error('KYC already exists for this user');
    }

    const kyc = await KYC.create({
      ...data,
      status: KYCStatus.PENDING,
      submittedAt: new Date(),
    });

    return kyc;
  }

  // Get KYC by user ID
  static async getKYCByUserId(userId: string): Promise<KYC | null> {
    return await KYC.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
    });
  }

  // Get KYC by ID
  static async getKYCById(kycId: string): Promise<KYC | null> {
    return await KYC.findByPk(kycId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
    });
  }

  // Get all KYC submissions with filters
  static async getAllKYC(filters: {
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ kycs: KYC[]; total: number; page: number; limit: number }> {
    const { status, page, limit } = filters;
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const { rows: kycs, count: total } = await KYC.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { kycs, total, page, limit };
  }

  // Review KYC (Admin)
  static async reviewKYC(kycId: string, reviewData: KYCReviewData): Promise<KYC> {
    const kyc = await KYC.findByPk(kycId);

    if (!kyc) {
      throw new Error('KYC not found');
    }

    // ✅ Now these comparisons will work correctly
    if (kyc.status !== KYCStatus.PENDING && kyc.status !== KYCStatus.IN_REVIEW) {
      throw new Error('KYC cannot be reviewed in its current status');
    }

    const updateData: any = {
      status: reviewData.status,
      reviewedBy: reviewData.reviewedBy,
      reviewedAt: new Date(),
    };

    if (reviewData.status === KYCStatus.APPROVED) {
      updateData.approvedAt = new Date();
      updateData.verificationLevel = reviewData.verificationLevel || VerificationLevel.BASIC;
      
      // Set expiry date (e.g., 1 year from approval)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      updateData.expiresAt = expiryDate;

      // Update user verification status
      await User.update(
        { isVerified: true },
        { where: { id: kyc.userId } }
      );
    } else if (reviewData.status === KYCStatus.REJECTED) {
      updateData.rejectionReason = reviewData.rejectionReason;
    }

    await kyc.update(updateData);
    return kyc;
  }

  // Update and resubmit KYC
  static async updateKYC(
    kycId: string,
    userId: string,
    updateData: KYCUpdateData
  ): Promise<KYC> {
    const kyc = await KYC.findByPk(kycId);

    if (!kyc) {
      throw new Error('KYC not found');
    }

    if (kyc.userId !== userId) {
      throw new Error('Unauthorized to update this KYC');
    }

    if (
      kyc.status !== KYCStatus.REJECTED &&
      kyc.status !== KYCStatus.RESUBMISSION_REQUIRED
    ) {
      throw new Error('KYC cannot be resubmitted in its current status');
    }

    await kyc.update({
      ...updateData,
      status: KYCStatus.PENDING,
      submittedAt: new Date(),
      rejectionReason: null,
    });

    return kyc;
  }

  // Delete KYC
  static async deleteKYC(
    kycId: string,
    userId: string,
    userRole?: UserRole
  ): Promise<void> {
    const kyc = await KYC.findByPk(kycId);

    if (!kyc) {
      throw new Error('KYC not found');
    }

    // Only admin or user (if status is pending) can delete
    if (userRole !== UserRole.ADMIN && kyc.userId !== userId) {
      throw new Error('Unauthorized to delete this KYC');
    }

    if (userRole !== UserRole.ADMIN && kyc.status !== KYCStatus.PENDING) {
      throw new Error('Can only delete pending KYC submissions');
    }

    await kyc.destroy();
  }

  // Check if KYC is expired
  static async checkAndUpdateExpiredKYC(): Promise<void> {
    await KYC.update(
      { status: KYCStatus.RESUBMISSION_REQUIRED },
      {
        where: {
          status: KYCStatus.APPROVED,
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      }
    );
  }
}
