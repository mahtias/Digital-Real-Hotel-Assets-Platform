import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resendVerificationEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDRABalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map