import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map