import { Request, Response } from "express";
export declare const getHotels: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getHotelById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createHotel: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateHotel: (req: Request, res: Response) => Promise<void>;
export declare const deleteHotel: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=hotelAssetController.d.ts.map