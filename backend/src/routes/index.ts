import { Router } from 'express';
import authRoutes from './authRoutes';
import kycRoutes from './kycRoutes';
import userRoutes from './userRoutes';
import hotelRoutes from './hotelRoutes';
import investmentRoutes from './investmentRoutes';
import bookingRoutes from './bookingRoutes'
import proposalRoutes from './proposalRoutes';
import stakingRoutes from './stakingRoutes'
import esgRewardRoutes from './esgRewardRoutes';
// import portfolioRoutes from './portfolioRoutes';
// import paymentRoutes from './paymentRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DigiRealAssets API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/kyc', kycRoutes);
router.use('/user', userRoutes);
router.use('/hotel', hotelRoutes);
router.use('/investments', investmentRoutes);
router.use('/book', bookingRoutes);
router.use('/proposals', proposalRoutes);
router.use('/staking', stakingRoutes);
router.use('/esgreward', esgRewardRoutes);

// router.use('/portfolios', portfolioRoutes);
// router.use('/payments', paymentRoutes);

export default router;
