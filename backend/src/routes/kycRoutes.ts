import express from 'express';
import * as kycController from '../controllers/kycController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads/kyc');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const kycValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
  body('nationality').notEmpty().withMessage('Nationality is required'),
  body('documentNumber').notEmpty().withMessage('documentNumber is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('documentType').notEmpty().withMessage('Document type is required'),
];

// Submit KYC
router.post(
  '/submit',
  authenticate,
  upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
    { name: "addressProof", maxCount: 1 }
  ]),
  [
    body('level').optional().isIn(['BASIC', 'INTERMEDIATE', 'ADVANCED','FULL']),
    body('fullName').notEmpty(),
    body('dateOfBirth').notEmpty(),
    body('nationality').notEmpty(),
    body('documentNumber').notEmpty(),
    body('address').notEmpty(),
  ],
  validateRequest,
  kycController.submitKYC
);

// Get user's KYC status
router.get('/status/:id', authenticate, kycController.getKYCStatus);

// Get all KYC submissions (Admin)
router.get(
  '/all',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  kycController.getAllKYC
);

// Get KYC statistics (Admin)
router.get('/statistics', authenticate, kycController.getKYCStatistics);

// Get KYC by ID
router.get(
  '/:id',
  authenticate,
  [param('id').isUUID()],
  validateRequest,
  kycController.getKYCById
);

// Review KYC (Admin)
router.put(
  '/:id/review',
  authenticate,
  [
    param('id').isUUID(),
    body('status').isIn(['APPROVED', 'REJECTED', 'PENDING']),
    body('rejectionReason').optional().isString(),
    body('verificationLevel').optional().isIn(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'FULL']),
  ],
  validateRequest,
  kycController.reviewKYC
);

// Update KYC (Resubmit)
router.put(
  '/:id',
  authenticate,
  upload.array('documents', 5),
  [param('id').isUUID()],
  validateRequest,
  kycController.updateKYC
);

// Delete KYC
router.delete(
  '/:id',
  authenticate,
  [param('id').isUUID()],
  validateRequest,
  kycController.deleteKYC
);

// Get all pending KYCs (Admin)
router.get(
  '/admin/pending',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const kycs = await kycController.getPendingKYCs();
      return res.json({ success: true, data: kycs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);
// Get full KYC details (Admin)
router.get(
  '/admin/details/:id',
  authenticate,
  [param('id').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      return kycController.getKYCById(req, res);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);
// Approve KYC (Admin)
router.post(
  '/admin/approve/:id',
  authenticate,
  [param('id').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      req.body.status = 'APPROVED';
      return kycController.reviewKYC(req, res);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Reject KYC (Admin)
router.post(
  '/admin/reject/:id',
  authenticate,
  [
    param('id').isUUID(),
    body('rejectionReason').notEmpty().withMessage('Rejection reason is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      req.body.status = 'REJECTED';
      return kycController.reviewKYC(req, res);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

// router.post(
//   '/admin/sync',
//   authenticate,
//   kycController.syncAllPendingKYCs
// );
// router.get(
//   '/admin/sync/stats',
//   authenticate,
//   kycController.getBlockchainSyncStats
// );

export default router;