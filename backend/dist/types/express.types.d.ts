import type { UserRole } from '@prisma/client';
export interface TokenPayload {
    userId: string;
    walletAddress: string;
    role: UserRole;
}
export interface AuthenticatedUser extends TokenPayload {
    email?: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
}
export interface AuthenticatedUser extends TokenPayload {
    email?: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
}
//# sourceMappingURL=express.types.d.ts.map