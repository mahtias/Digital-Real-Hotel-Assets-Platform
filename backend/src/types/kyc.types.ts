export enum KYCStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RESUBMISSION_REQUIRED = 'resubmission_required',
}

export enum VerificationLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  FULL = "FULL",
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  RESIDENCE_PERMIT = 'residence_permit',
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
  documentType: DocumentType;
  documentNumber: string;
  address: Address;
  documentFront?: string;
  documentBack?: string;
  selfieImage?: string;
  addressProof?: string;
}

export interface KYCReviewData {
  status: KYCStatus;
  rejectionReason?: string;
  verificationLevel?: VerificationLevel;
  reviewedBy: string;
}

export interface KYCUpdateData {
  fullName?: string;
  dateOfBirth?: Date;
  nationality?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  address?: Address;
  documentFront?: string;
  documentBack?: string;
  selfieImage?: string;
  addressProof?: string;
}
