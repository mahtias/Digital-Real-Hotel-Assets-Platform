"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHotelsPerformance = exports.getLatestPerformance = exports.getPerformanceHistory = exports.recordPerformance = void 0;
const performanceService_1 = require("../services/performanceService");
const recordPerformance = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        const { hotelAssetId, period } = req.body;
        if (!hotelAssetId) {
            return res.status(400).json({ success: false, message: "hotelAssetId is required" });
        }
        const record = await performanceService_1.performanceService.recordPerformance(hotelAssetId, adminId, period);
        return res.status(201).json({
            success: true,
            message: `Performance recorded for period ${record.period}`,
            data: record,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.recordPerformance = recordPerformance;
const getPerformanceHistory = async (req, res) => {
    try {
        const { hotelAssetId } = req.params;
        const limit = Number(req.query.limit) || 12;
        const history = await performanceService_1.performanceService.getPerformanceHistory(hotelAssetId, limit);
        return res.json({ success: true, count: history.length, data: history });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPerformanceHistory = getPerformanceHistory;
const getLatestPerformance = async (req, res) => {
    try {
        const { hotelAssetId } = req.params;
        const record = await performanceService_1.performanceService.getLatestPerformance(hotelAssetId);
        return res.json({ success: true, data: record ?? null });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLatestPerformance = getLatestPerformance;
const getAllHotelsPerformance = async (req, res) => {
    try {
        const period = req.query.period;
        const data = await performanceService_1.performanceService.getAllHotelsPerformance(period);
        return res.json({ success: true, count: data.length, data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllHotelsPerformance = getAllHotelsPerformance;
//# sourceMappingURL=performanceController.js.map