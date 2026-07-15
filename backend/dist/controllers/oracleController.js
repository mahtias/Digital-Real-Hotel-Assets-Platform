"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOracleStatus = exports.getOnChainHotelData = exports.getOnChainPerformance = exports.requestPerformanceUpdate = void 0;
const oracleService_1 = require("../services/oracleService");
const database_1 = __importDefault(require("../config/database"));
const requestPerformanceUpdate = async (req, res) => {
    try {
        if (!oracleService_1.oracleService.isReady()) {
            return res.status(503).json({
                success: false,
                message: "Chainlink not configured. Set CHAINLINK_SUBSCRIPTION_ID in .env — create one at https://functions.chain.link",
            });
        }
        const { hotelAssetId } = req.body;
        if (!hotelAssetId) {
            return res.status(400).json({ success: false, message: "hotelAssetId is required" });
        }
        const hotel = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelAssetId },
            select: { blockchainId: true, name: true },
        });
        if (!hotel?.blockchainId) {
            return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
        }
        const apiUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/v1/performance/${hotelAssetId}/latest`;
        const result = await oracleService_1.oracleService.requestPerformanceUpdate(hotel.blockchainId, apiUrl);
        return res.json({
            success: true,
            message: "Chainlink request sent — performance data will be posted on-chain within ~60 seconds",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.requestPerformanceUpdate = requestPerformanceUpdate;
const getOnChainPerformance = async (req, res) => {
    try {
        const { hotelAssetId } = req.params;
        const hotel = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelAssetId },
            select: { blockchainId: true, name: true },
        });
        if (!hotel?.blockchainId) {
            return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
        }
        const data = await oracleService_1.oracleService.getOnChainPerformance(hotel.blockchainId);
        return res.json({ success: true, data: { hotelName: hotel.name, ...data } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOnChainPerformance = getOnChainPerformance;
const getOnChainHotelData = async (req, res) => {
    try {
        const { hotelAssetId } = req.params;
        const hotel = await database_1.default.hotelAsset.findUnique({
            where: { id: hotelAssetId },
            select: { blockchainId: true, name: true },
        });
        if (!hotel?.blockchainId) {
            return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
        }
        const data = await oracleService_1.oracleService.getOnChainHotelData(hotel.blockchainId);
        return res.json({ success: true, data: { hotelName: hotel.name, ...data } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOnChainHotelData = getOnChainHotelData;
const getOracleStatus = async (_req, res) => {
    return res.json({
        success: true,
        data: {
            contractAddress: process.env.HOTEL_ORACLE_ADDRESS,
            subscriptionConfigured: oracleService_1.oracleService.isReady(),
            donId: process.env.CHAINLINK_DON_ID,
            network: "Base Sepolia",
        },
    });
};
exports.getOracleStatus = getOracleStatus;
//# sourceMappingURL=oracleController.js.map