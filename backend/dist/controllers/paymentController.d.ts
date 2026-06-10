import { Request, Response } from "express";
export declare const createPaymentIntent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=paymentController.d.ts.map