import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  submitKYC,
  getKYCStatus,
  getAllKYCSubmissions,
  getKYCById,
  approveKYC,
  rejectKYC,
  uploadKYCDocument,
  requestKYCResubmission
} from '../controllers/kycController';
import { documentUpload, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// User KYC routes
router.post(
  '/submit',
  authenticate,
  documentUpload.fields([
    { name: 'frontDocument', maxCount: 1 },
    { name: 'backDocument', maxCount: 1 },
    { name: 'selfieDocument', maxCount: 1 }
  ]),
  handleUploadError,
  submitKYC
);

router.get('/status', authenticate, getKYCStatus);

router.post(
  '/upload-document',
  authenticate,
  documentUpload.single('document'),
  handleUploadError,
  uploadKYCDocument
);

// Admin/Compliance Officer routes
router.get(
  '/',
  authenticate,
  authorize('admin', 'compliance_officer'),
  getAllKYCSubmissions
);

router.get(
  '/:kycId',
  authenticate,
  authorize('admin', 'compliance_officer'),
  getKYCById
);

router.put(
  '/:kycId/approve',
  authenticate,
  authorize('admin', 'compliance_officer'),
  approveKYC
);

router.put(
  '/:kycId/reject',
  authenticate,
  authorize('admin', 'compliance_officer'),
  rejectKYC
);

router.put(
  '/:kycId/request-resubmission',
  authenticate,
  authorize('admin', 'compliance_officer'),
  requestKYCResubmission
);

export default router;
