"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const kycRoutes_1 = __importDefault(require("./kycRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const hotelAssetRoutes_1 = __importDefault(require("./hotelAssetRoutes"));
const investmentRoutes_1 = __importDefault(require("./investmentRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const proposalRoutes_1 = __importDefault(require("./proposalRoutes"));
const stakingRoutes_1 = __importDefault(require("./stakingRoutes"));
const esgRewardRoutes_1 = __importDefault(require("./esgRewardRoutes"));
const qloRoutes_1 = __importDefault(require("./qloRoutes"));
const settlementRoutes_1 = __importDefault(require("./settlementRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const revenueRoutes_1 = __importDefault(require("./revenueRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const yieldRoutes_1 = __importDefault(require("./yieldRoutes"));
const snapshotRoutes_1 = __importDefault(require("./snapshotRoutes"));
const performanceRoutes_1 = __importDefault(require("./performanceRoutes"));
const oracleRoutes_1 = __importDefault(require("./oracleRoutes"));
const engineRoutes_1 = __importDefault(require("./engineRoutes"));
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DigiRealAssets API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
router.use('/auth', authRoutes_1.default);
router.use('/kyc', kycRoutes_1.default);
router.use('/user', userRoutes_1.default);
router.use('/hotels', hotelAssetRoutes_1.default);
router.use('/investments', investmentRoutes_1.default);
router.use('/bookings', bookingRoutes_1.default);
router.use('/proposals', proposalRoutes_1.default);
router.use('/staking', stakingRoutes_1.default);
router.use('/esgreward', esgRewardRoutes_1.default);
router.use('/webhook', qloRoutes_1.default);
router.use('/payments', paymentRoutes_1.default);
router.use('/settlements', settlementRoutes_1.default);
router.use('/admin/revenue', revenueRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
router.use('/yield', yieldRoutes_1.default);
router.use('/admin/snapshot', snapshotRoutes_1.default);
router.use('/performance', performanceRoutes_1.default);
router.use('/admin/oracle', oracleRoutes_1.default);
router.use('/admin/engine', engineRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map