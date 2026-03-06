import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        userId: string;
        email?: string;
        role: string;
        walletAddress?: string | null;
    };
    walletAddress?: string;
}
export declare const createInvestment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmInvestment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserInvestments: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInvestmentById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInvestmentStats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInvestmentsByStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateInvestment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteInvestment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelInvestment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=investmentController.d.ts.map