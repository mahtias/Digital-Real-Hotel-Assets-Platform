import { Request, Response } from "express";
export declare const getVaultStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getClaimableYield: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getYieldHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markClaimed: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const distributeYield: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=yieldController.d.ts.map