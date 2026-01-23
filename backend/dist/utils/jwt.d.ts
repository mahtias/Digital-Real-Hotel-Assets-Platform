import { UserRole } from '@prisma/client';
export interface TokenPayload {
    userId: string;
    role: UserRole;
    walletAddress?: string | null;
    iat?: number;
    exp?: number;
}
export interface RefreshTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (userId: string, role: UserRole, walletAddress?: string | null) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload | null;
export declare const decodeToken: (token: string) => TokenPayload | null;
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | undefined;
//# sourceMappingURL=jwt.d.ts.map