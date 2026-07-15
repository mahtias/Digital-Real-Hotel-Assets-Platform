"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oracleService = exports.OracleService = void 0;
const ethers_1 = require("ethers");
const HotelOracle_json_1 = __importDefault(require("../../../out/HotelOracle.sol/HotelOracle.json"));
const ORACLE_ADDRESS = process.env.HOTEL_ORACLE_ADDRESS;
const SUBSCRIPTION_ID = process.env.CHAINLINK_SUBSCRIPTION_ID;
const DON_ID_STR = process.env.CHAINLINK_DON_ID || "fun-base-sepolia-1";
const GAS_LIMIT = 300_000;
function donIdToBytes32(donId) {
    return ethers_1.ethers.encodeBytes32String(donId);
}
class OracleService {
    constructor() {
        const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
        if (!rpc)
            throw new Error("Missing BASE_SEPOLIA_RPC");
        if (!process.env.PRIVATE_KEY)
            throw new Error("Missing PRIVATE_KEY");
        if (!ORACLE_ADDRESS)
            throw new Error("Missing HOTEL_ORACLE_ADDRESS");
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpc);
        this.signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.contract = new ethers_1.ethers.Contract(ORACLE_ADDRESS, HotelOracle_json_1.default.abi, this.signer);
    }
    async requestPerformanceUpdate(hotelBlockchainId, apiUrl) {
        if (!SUBSCRIPTION_ID || SUBSCRIPTION_ID === "") {
            throw new Error("CHAINLINK_SUBSCRIPTION_ID not set. Create one at https://functions.chain.link and add it to .env");
        }
        const tx = await this.contract.requestPerformanceData(hotelBlockchainId, apiUrl, Number(SUBSCRIPTION_ID), GAS_LIMIT, donIdToBytes32(DON_ID_STR));
        const receipt = await tx.wait();
        return { txHash: receipt.hash, hotelBlockchainId, apiUrl };
    }
    async requestHotelDataUpdate(hotelBlockchainId, apiUrl) {
        if (!SUBSCRIPTION_ID || SUBSCRIPTION_ID === "") {
            throw new Error("CHAINLINK_SUBSCRIPTION_ID not set. Create one at https://functions.chain.link and add it to .env");
        }
        const tx = await this.contract.requestHotelData(hotelBlockchainId, apiUrl, Number(SUBSCRIPTION_ID), GAS_LIMIT, donIdToBytes32(DON_ID_STR));
        const receipt = await tx.wait();
        return { txHash: receipt.hash, hotelBlockchainId, apiUrl };
    }
    async getOnChainPerformance(hotelBlockchainId) {
        const [occupancyRate, revenue, revpar, bookingCount, period, lastUpdated] = await this.contract.getPerformanceData(hotelBlockchainId);
        return {
            hotelBlockchainId,
            occupancyRate: Number(occupancyRate) / 100,
            revenue: Number(revenue) / 100,
            revpar: Number(revpar) / 100,
            bookingCount: Number(bookingCount),
            period: period,
            lastUpdated: Number(lastUpdated) > 0
                ? new Date(Number(lastUpdated) * 1000).toISOString()
                : null,
            hasData: Number(lastUpdated) > 0,
        };
    }
    async getOnChainHotelData(hotelBlockchainId) {
        const [name, location, imageUrl, rooms, rating, lastUpdated] = await this.contract.getHotelData(hotelBlockchainId);
        return {
            hotelBlockchainId,
            name, location, imageUrl,
            rooms: Number(rooms),
            rating: Number(rating),
            lastUpdated: Number(lastUpdated) > 0
                ? new Date(Number(lastUpdated) * 1000).toISOString()
                : null,
            hasData: Number(lastUpdated) > 0,
        };
    }
    isReady() {
        return !!SUBSCRIPTION_ID && SUBSCRIPTION_ID !== "";
    }
}
exports.OracleService = OracleService;
exports.oracleService = new OracleService();
//# sourceMappingURL=oracleService.js.map