import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        userId: string;
        email?: string;
        role: string;
        walletAddress?: string | null;
    };
}
export declare const getUserTokens: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const getUserPortfolio: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const confirmAllInvestments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateWalletAddress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserTransactions: (req: Request, res: Response) => Promise<void>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateUserRole: (req: Request, res: Response) => Promise<void>;
export declare const deactivateUser: (req: Request, res: Response) => Promise<void>;
export declare const getUserStatistics: (req: Request, res: Response) => Promise<void>;
export declare const reactivateUser: (req: Request, res: Response) => Promise<void>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=userController.d.ts.map