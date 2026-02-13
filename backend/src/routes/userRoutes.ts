import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import {getUserProfile, updateUserProfile, getUserPortfolio, getUserTransactions,confirmAllInvestments,getUserTokens,
  getAllUsers,updateUserRole,deactivateUser, getUserStatistics, reactivateUser,updateWalletAddress } from '../controllers/userController';

const router = Router();

//  Add wallet update route
router.patch('/wallet', authenticate, updateWalletAddress);
// Current user routes
router.get('/profile', authenticate, getUserProfile);

router.put('/profile', authenticate, updateUserProfile);

router.get('/portfolio', authenticate, getUserPortfolio);

router.get('/transactions', authenticate, getUserTransactions);
router.get('/tokens', authenticate, getUserTokens);  
router.patch('/investments/confirm-all', confirmAllInvestments);


// Admin user management routes
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  getAllUsers
);

router.get(
  '/:userId/statistics',
  authenticate,
  authorize(UserRole.ADMIN),
  getUserStatistics
);

router.put(
  '/:userId/role',
  authenticate,
  authorize(UserRole.ADMIN),
  updateUserRole
);

router.delete(
  '/:userId',
  authenticate,
  authorize(UserRole.ADMIN),
  deactivateUser
);

router.post(
  '/:userId/reactivate',
  authenticate,
  authorize(UserRole.ADMIN),
  reactivateUser
);

export default router;
