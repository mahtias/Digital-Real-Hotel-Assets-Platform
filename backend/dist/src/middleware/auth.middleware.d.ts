import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireEmailVerified: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireKYCVerified: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map