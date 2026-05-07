import { Router } from 'express';
import authRoutes from './authRoutes';
import kycRoutes from './kycRoutes';
import userRoutes from './userRoutes';
import hotelRoutes from './hotelAssetRoutes';
import investmentRoutes from './investmentRoutes';
import bookingRoutes from './bookingRoutes'
import proposalRoutes from './proposalRoutes';
import stakingRoutes from './stakingRoutes'
import esgRewardRoutes from './esgRewardRoutes';
import qloRoutes  from './qloRoutes'
import settlementRoutes from './settlementRoutes';
// import portfolioRoutes from './portfolioRoutes';
import paymentRoutes from './paymentRoutes';
import revenueRoutes from './revenueRoutes'
import adminRoutes from './adminRoutes';

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
router.use('/hotels', hotelRoutes);
router.use('/investments', investmentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/proposals', proposalRoutes);
router.use('/staking', stakingRoutes);
router.use('/esgreward', esgRewardRoutes);
router.use('/webhook', qloRoutes)
router.use('/payments', paymentRoutes);
router.use('/settlements', settlementRoutes); 
router.use('/admin/revenue', revenueRoutes);
router.use('/admin', adminRoutes);
// router.use('/portfolios', portfolioRoutes); 


export default router;
