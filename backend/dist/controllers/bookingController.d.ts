import { Request, Response } from "express";
export declare const createBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserBookings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingsByHotelAsset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBookingStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmBookingPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllBookingsAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=bookingController.d.ts.map