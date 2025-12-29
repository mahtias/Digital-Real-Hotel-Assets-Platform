import { IKYC, KYCStatus, VerificationLevel } from '../types/kyc.types';
import { User } from '../models/User';
export declare function isKYCApproved(kyc: IKYC | null | undefined): boolean;
export declare function canUserInvest(user: User, kyc: IKYC | null | undefined): boolean;
export declare function isKYCPending(kyc: IKYC | null | undefined): boolean;
export declare function requiresFullKYC(verificationLevel: VerificationLevel): boolean;
export declare function getKYCStatusColor(status: KYCStatus): string;
//# sourceMappingURL=typeGuards.d.ts.map