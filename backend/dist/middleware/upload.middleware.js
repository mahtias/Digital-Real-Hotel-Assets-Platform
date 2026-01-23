"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteUploadedFile = exports.handleUploadError = exports.uploadMiddleware = exports.propertyImageUpload = exports.kycUpload = exports.documentUpload = exports.avatarUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
const avatarsDir = path_1.default.join(uploadsDir, 'avatars');
const documentsDir = path_1.default.join(uploadsDir, 'documents');
const propertiesDir = path_1.default.join(uploadsDir, 'properties');
[uploadsDir, avatarsDir, documentsDir, propertiesDir].forEach(dir => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = uploadsDir;
        if (file.fieldname === 'avatar') {
            uploadPath = avatarsDir;
        }
        else if (file.fieldname.includes('document') || file.fieldname.includes('Document')) {
            uploadPath = documentsDir;
        }
        else if (file.fieldname.includes('image') || file.fieldname.includes('Image')) {
            uploadPath = propertiesDir;
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto_1.default.randomBytes(16).toString('hex');
        const ext = path_1.default.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});
const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
};
const documentFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'));
    }
};
const kycFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF and image files are allowed for KYC.'));
    }
};
const limits = {
    fileSize: 5 * 1024 * 1024,
    avatar: 2 * 1024 * 1024,
    document: 10 * 1024 * 1024,
    propertyImage: 5 * 1024 * 1024
};
exports.avatarUpload = (0, multer_1.default)({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: limits.avatar }
});
exports.documentUpload = (0, multer_1.default)({
    storage,
    fileFilter: documentFilter,
    limits: { fileSize: limits.document }
});
exports.kycUpload = (0, multer_1.default)({
    storage,
    fileFilter: kycFilter,
    limits: { fileSize: limits.document }
});
exports.propertyImageUpload = (0, multer_1.default)({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: limits.propertyImage }
});
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: limits.fileSize }
});
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large',
                maxSize: '5MB'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name',
                error: error.message
            });
        }
    }
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'File upload error'
        });
    }
    next();
};
exports.handleUploadError = handleUploadError;
const deleteUploadedFile = (filepath) => {
    try {
        const fullPath = path_1.default.join(process.cwd(), filepath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
    catch (error) {
        console.error('Error deleting file:', error);
    }
};
exports.deleteUploadedFile = deleteUploadedFile;
const getFileUrl = (filename, folder = '') => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads${folder ? '/' + folder : ''}/${filename}`;
};
exports.getFileUrl = getFileUrl;
exports.default = {
    uploadMiddleware: exports.uploadMiddleware,
    avatarUpload: exports.avatarUpload,
    documentUpload: exports.documentUpload,
    kycUpload: exports.kycUpload,
    propertyImageUpload: exports.propertyImageUpload,
    handleUploadError: exports.handleUploadError,
    deleteUploadedFile: exports.deleteUploadedFile,
    getFileUrl: exports.getFileUrl
};
//# sourceMappingURL=upload.middleware.js.map