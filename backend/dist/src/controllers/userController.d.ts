import { Request, Response } from 'express';
export declare const getUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const getUserPortfolio: (req: Request, res: Response) => Promise<void>;
export declare const updateWalletAddress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserTransactions: (req: Request, res: Response) => Promise<void>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateUserRole: (req: Request, res: Response) => Promise<void>;
export declare const deactivateUser: (req: Request, res: Response) => Promise<void>;
export declare const getUserStatistics: (req: Request, res: Response) => Promise<void>;
export declare const reactivateUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map