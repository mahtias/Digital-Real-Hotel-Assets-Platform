import multer from 'multer';
export declare const upload: multer.Multer;
export declare const processAndSaveImage: (buffer: Buffer, filename: string, folder?: string) => Promise<string>;
export declare const deleteFile: (filepath: string) => Promise<void>;
export declare const validateImage: (buffer: Buffer) => Promise<boolean>;
//# sourceMappingURL=uploadService.d.ts.map