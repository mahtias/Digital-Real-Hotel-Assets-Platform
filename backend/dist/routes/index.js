"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const kycRoutes_1 = __importDefault(require("./kycRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const hotelRoutes_1 = __importDefault(require("./hotelRoutes"));
const investmentRoutes_1 = __importDefault(require("./investmentRoutes"));
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const proposalRoutes_1 = __importDefault(require("./proposalRoutes"));
const stakingRoutes_1 = __importDefault(require("./stakingRoutes"));
const esgRewardRoutes_1 = __importDefault(require("./esgRewardRoutes"));
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
router.use('/hotel', hotelRoutes_1.default);
router.use('/investments', investmentRoutes_1.default);
router.use('/book', bookingRoutes_1.default);
router.use('/proposals', proposalRoutes_1.default);
router.use('/staking', stakingRoutes_1.default);
router.use('/esgreward', esgRewardRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map