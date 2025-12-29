// src/types/kyc.types.ts

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESUBMISSION_REQUIRED = 'RESUBMISSION_REQUIRED',
}

export enum VerificationLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  FULL = 'FULL',
}

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface KYCSubmissionData {
  userId: string;
  fullName: string;
  dateOfBirth: Date;
  nationality: string;
  phoneNumber?: string;
  documentType: DocumentType;
  documentNumber: string;
  address: Address;
  documentFront?: string;
  documentBack?: string;
  selfieImage?: string;
  addressProof?: string;
  walletAddress?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface KYCReviewData {
  kycId: string;
  status: KYCStatus;
  rejectionReason?: string;
  verificationLevel?: VerificationLevel;
  reviewedBy: string;
  expiresAt?: Date;
}

export interface KYCUpdateData {
  fullName?: string;
  dateOfBirth?: Date;
  nationality?: string;
  phoneNumber?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  address?: Address;
  documentFront?: string;
  documentBack?: string;
  selfieImage?: string;
  addressProof?: string;
}

// Blockchain-specific types
export interface BlockchainKYCData {
  walletAddress: string;
  documentHash: string;
  verificationLevel: VerificationLevel;
  expiresAt: Date;
}

export interface KYCBlockchainSubmission {
  kycId: string;
  txHash: string;
  blockNumber?: number;
  gasUsed?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface IKYC {
  id: string;
  userId: string;
  status: KYCStatus;
  verificationLevel?: VerificationLevel;
}