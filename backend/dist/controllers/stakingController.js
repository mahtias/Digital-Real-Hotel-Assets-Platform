"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstake = exports.claimStakingRewards = exports.getUserStakings = exports.createStaking = void 0;
const database_1 = __importDefault(require("../config/database"));
const date_fns_1 = require("date-fns");
const createStaking = async (req, res) => {
    try {
        const { userId, stakedAmount, lockPeriodDays, apyRate, createdById } = req.body;
        const now = new Date();
        const stake = await database_1.default.staking.create({
            data: {
                userId,
                stakedAmount,
                lockPeriodDays,
                apyRate,
                stakeStartDate: now,
                stakeEndDate: (0, date_fns_1.addDays)(now, lockPeriodDays),
                createdById
            }
        });
        return res.status(201).json(stake);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create staking" });
    }
};
exports.createStaking = createStaking;
const getUserStakings = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const userId = req.user.userId;
        const stakings = await database_1.default.staking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        return res.json(stakings);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to fetch stakings" });
    }
};
exports.getUserStakings = getUserStakings;
const claimStakingRewards = async (req, res) => {
    try {
        const { id } = req.params;
        const stake = await database_1.default.staking.findUnique({ where: { id } });
        if (!stake)
            return res.status(404).json({ message: "Stake not found" });
        const updated = await database_1.default.staking.update({
            where: { id },
            data: {
                claimedRewards: stake.claimedRewards + stake.earnedRewards,
                earnedRewards: 0,
                status: "REWARDED"
            }
        });
        return res.json(updated);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to claim rewards" });
    }
};
exports.claimStakingRewards = claimStakingRewards;
const unstake = async (req, res) => {
    try {
        const { id } = req.params;
        const stake = await database_1.default.staking.findUnique({ where: { id } });
        if (!stake)
            return res.status(404).json({ message: "Stake not found" });
        if (stake.status !== "ACTIVE")
            return res.status(400).json({ message: "Can only unstake ACTIVE stake" });
        const updated = await database_1.default.staking.update({
            where: { id },
            data: { status: "UNSTAKED" }
        });
        return res.json(updated);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to unstake" });
    }
};
exports.unstake = unstake;
//# sourceMappingURL=stakingController.js.map