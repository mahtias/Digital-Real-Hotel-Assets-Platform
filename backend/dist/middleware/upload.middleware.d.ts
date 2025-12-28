import multer from 'multer';
import { Request } from 'express';
export declare const avatarUpload: multer.Multer;
export declare const documentUpload: multer.Multer;
export declare const kycUpload: multer.Multer;
export declare const propertyImageUpload: multer.Multer;
export declare const uploadMiddleware: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: any, next: any) => any;
export declare const deleteUploadedFile: (filepath: string) => void;
export declare const getFileUrl: (filename: string, folder?: string) => string;
declare const _default: {
    uploadMiddleware: multer.Multer;
    avatarUpload: multer.Multer;
    documentUpload: multer.Multer;
    kycUpload: multer.Multer;
    propertyImageUpload: multer.Multer;
    handleUploadError: (error: any, req: Request, res: any, next: any) => any;
    deleteUploadedFile: (filepath: string) => void;
    getFileUrl: (filename: string, folder?: string) => string;
};
export default _default;
//# sourceMappingURL=upload.middleware.d.ts.map