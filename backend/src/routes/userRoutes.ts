import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getUserProfile,
  updateUserProfile,
  getUserPortfolio,
  getUserTransactions,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getUserStatistics,
  reactivateUser
} from '../controllers/userController';

const router = Router();

// Current user routes
router.get('/profile', authenticate, getUserProfile);

router.put(
  '/profile',
  authenticate,
  updateUserProfile
);

router.get('/portfolio', authenticate, getUserPortfolio);

router.get('/transactions', authenticate, getUserTransactions);

// Admin user management routes
router.get(
  '/',
  authenticate,
  authorize('admin'),
  getAllUsers
);

router.get(
  '/:userId/statistics',
  authenticate,
  authorize('admin'),
  getUserStatistics
);

router.put(
  '/:userId/role',
  authenticate,
  authorize('admin'),
  updateUserRole
);

router.delete(
  '/:userId',
  authenticate,
  authorize('admin'),
  deactivateUser
);

router.post(
  '/:userId/reactivate',
  authenticate,
  authorize('admin'),
  reactivateUser
);

export default router;
