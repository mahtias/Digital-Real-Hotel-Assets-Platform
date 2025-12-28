import { Request, Response } from 'express';
export declare const submitKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getKYCStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getKYCById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const reviewKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyKYCOnBlockchain: (req: Request, res: Response) => Promise<void>;
export declare const syncBlockchainStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getKYCStatistics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkExpiredKYC: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=kycController.d.ts.map