import { KYC } from '../models/KYC';
import { User } from '../models/User';
import { KYCStatus, VerificationLevel } from '../types/kyc.types';
export declare function isKYCApproved(kyc: KYC | null | undefined): boolean;
export declare function canUserInvest(user: User, kyc: KYC | null | undefined): boolean;
export declare function isKYCPending(kyc: KYC | null | undefined): boolean;
export declare function requiresFullKYC(verificationLevel: VerificationLevel): boolean;
export declare function getKYCStatusColor(status: KYCStatus): string;
//# sourceMappingURL=typeGuards.d.ts.map