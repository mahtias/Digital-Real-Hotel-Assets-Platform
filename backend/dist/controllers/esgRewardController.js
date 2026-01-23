"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReward = exports.getReward = exports.claimReward = exports.createReward = exports.getRewardsByUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const getRewardsByUser = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Missing email" });
        }
        const rewards = await database_1.default.esgReward.findMany({
            where: { user_email: email },
            orderBy: { created_date: "desc" }
        });
        return res.json(rewards);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getRewardsByUser = getRewardsByUser;
const createReward = async (req, res) => {
    try {
        const { user_email, action_type, reward_amount } = req.body;
        const reward = await database_1.default.esgReward.create({
            data: {
                user_email,
                action_type,
                reward_amount,
                status: "pending"
            }
        });
        return res.json(reward);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.createReward = createReward;
const claimReward = async (req, res) => {
    try {
        const rewardId = req.params.id;
        const reward = await database_1.default.esgReward.update({
            where: { id: rewardId },
            data: { status: "claimed" }
        });
        return res.json(reward);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.claimReward = claimReward;
const getReward = async (req, res) => {
    try {
        const reward = await database_1.default.esgReward.findUnique({
            where: { id: req.params.id }
        });
        if (!reward)
            return res.status(404).json({ error: "Not found" });
        return res.json(reward);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getReward = getReward;
const deleteReward = async (req, res) => {
    try {
        await database_1.default.esgReward.delete({
            where: { id: req.params.id }
        });
        return res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.deleteReward = deleteReward;
//# sourceMappingURL=esgRewardController.js.map