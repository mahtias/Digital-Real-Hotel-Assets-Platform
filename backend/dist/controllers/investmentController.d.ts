import { Request, Response } from "express";
export declare const getUserInvestments: (req: any, res: Response) => Promise<void>;
export declare const createInvestment: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInvestmentById: (req: Request, res: Response) => Promise<void>;
export declare const updateInvestment: (req: Request, res: Response) => Promise<void>;
export declare const deleteInvestment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=investmentController.d.ts.map