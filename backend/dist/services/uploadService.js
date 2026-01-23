"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.deleteFile = exports.processAndSaveImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ensureUploadDir = async () => {
    try {
        await promises_1.default.access(UPLOAD_DIR);
    }
    catch {
        await promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
    }
};
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});
const processAndSaveImage = async (buffer, filename, folder = 'kyc') => {
    await ensureUploadDir();
    const uploadPath = path_1.default.join(UPLOAD_DIR, folder);
    await promises_1.default.mkdir(uploadPath, { recursive: true });
    const uniqueFilename = `${(0, uuid_1.v4)()}-${filename}`;
    const filepath = path_1.default.join(uploadPath, uniqueFilename);
    await (0, sharp_1.default)(buffer)
        .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
    })
        .jpeg({ quality: 85 })
        .toFile(filepath);
    return `/${folder}/${uniqueFilename}`;
};
exports.processAndSaveImage = processAndSaveImage;
const deleteFile = async (filepath) => {
    try {
        const fullPath = path_1.default.join(UPLOAD_DIR, filepath);
        await promises_1.default.unlink(fullPath);
    }
    catch (error) {
        console.error('Error deleting file:', error);
    }
};
exports.deleteFile = deleteFile;
const validateImage = async (buffer) => {
    try {
        const metadata = await (0, sharp_1.default)(buffer).metadata();
        return !!(metadata.width && metadata.height);
    }
    catch {
        return false;
    }
};
exports.validateImage = validateImage;
//# sourceMappingURL=uploadService.js.map