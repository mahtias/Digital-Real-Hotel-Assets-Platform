import { KYC } from '../models/KYC';
import { User } from '../models/User';
import { KYCStatus, VerificationLevel } from '../types/kyc.types';

export function isKYCApproved(kyc: KYC | null | undefined): boolean {
  return kyc?.status === KYCStatus.APPROVED;
}

export function canUserInvest(user: User, kyc: KYC | null | undefined): boolean {
  return user.isActive && user.isVerified && isKYCApproved(kyc);
}

export function isKYCPending(kyc: KYC | null | undefined): boolean {
  if (!kyc) return false;
  return kyc.status === KYCStatus.PENDING || kyc.status === KYCStatus.IN_REVIEW;
}

export function requiresFullKYC(verificationLevel: VerificationLevel): boolean {
  return verificationLevel === VerificationLevel.FULL;
}

export function getKYCStatusColor(status: KYCStatus): string {
  const colors: Record<KYCStatus, string> = {
    [KYCStatus.NOT_STARTED]: 'gray',
    [KYCStatus.PENDING]: 'yellow',
    [KYCStatus.IN_REVIEW]: 'blue',
    [KYCStatus.APPROVED]: 'green',
    [KYCStatus.REJECTED]: 'red',
    [KYCStatus.RESUBMISSION_REQUIRED]: 'orange',
  };
  return colors[status] || 'gray';
}
