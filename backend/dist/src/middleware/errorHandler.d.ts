import { Request, Response, NextFunction } from "express";
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void;
export declare function validationError(errors: any): AppError;
export declare function handleUnhandledRejection(): void;
export declare function handleUncaughtException(): void;
//# sourceMappingURL=errorHandler.d.ts.map