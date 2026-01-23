"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kycController = __importStar(require("../controllers/kycController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, '../../uploads/kyc');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
const kycValidation = [
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name is required'),
    (0, express_validator_1.body)('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
    (0, express_validator_1.body)('nationality').notEmpty().withMessage('Nationality is required'),
    (0, express_validator_1.body)('documentNumber').notEmpty().withMessage('documentNumber is required'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('documentType').notEmpty().withMessage('Document type is required'),
];
router.post('/submit', auth_1.authenticate, upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
    { name: "addressProof", maxCount: 1 }
]), [
    (0, express_validator_1.body)('level').optional().isIn(['BASIC', 'INTERMEDIATE', 'ADVANCED']),
    (0, express_validator_1.body)('fullName').notEmpty(),
    (0, express_validator_1.body)('dateOfBirth').notEmpty(),
    (0, express_validator_1.body)('nationality').notEmpty(),
    (0, express_validator_1.body)('documentNumber').notEmpty(),
    (0, express_validator_1.body)('address').notEmpty(),
], validation_1.validateRequest, kycController.submitKYC);
router.get('/status', auth_1.authenticate, kycController.getKYCStatus);
router.get('/all', auth_1.authenticate, [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
], validation_1.validateRequest, kycController.getAllKYC);
router.get('/statistics', auth_1.authenticate, kycController.getKYCStatistics);
router.get('/:id', auth_1.authenticate, [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, kycController.getKYCById);
router.put('/:id/review', auth_1.authenticate, [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('status').isIn(['APPROVED', 'REJECTED', 'PENDING']),
    (0, express_validator_1.body)('rejectionReason').optional().isString(),
    (0, express_validator_1.body)('verificationLevel').optional().isIn(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'FULL']),
], validation_1.validateRequest, kycController.reviewKYC);
router.put('/:id', auth_1.authenticate, upload.array('documents', 5), [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, kycController.updateKYC);
router.delete('/:id', auth_1.authenticate, [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, kycController.deleteKYC);
router.get('/admin/pending', auth_1.authenticate, async (req, res) => {
    try {
        const kycs = await kycController.getPendingKYCs();
        return res.json({ success: true, data: kycs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
router.get('/admin/details/:id', auth_1.authenticate, [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, async (req, res) => {
    try {
        return kycController.getKYCById(req, res);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/admin/approve/:id', auth_1.authenticate, [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, async (req, res) => {
    try {
        req.body.status = 'APPROVED';
        return kycController.reviewKYC(req, res);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/admin/reject/:id', auth_1.authenticate, [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('rejectionReason').notEmpty().withMessage('Rejection reason is required'),
], validation_1.validateRequest, async (req, res) => {
    try {
        req.body.status = 'REJECTED';
        return kycController.reviewKYC(req, res);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=kycRoutes.js.map