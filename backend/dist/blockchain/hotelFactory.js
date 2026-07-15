"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelFactory = void 0;
const ethers_1 = require("ethers");
const HotelTokenFactory_json_1 = __importDefault(require("../../../out/HotelTokenFactory.sol/HotelTokenFactory.json"));
const FACTORY_ABI = HotelTokenFactory_json_1.default.abi;
const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS;
function getProvider() {
    const rpc = process.env.RPC_URL || process.env.BASE_SEPOLIA_RPC;
    if (!rpc)
        throw new Error("Missing RPC_URL environment variable");
    return new ethers_1.ethers.JsonRpcProvider(rpc);
}
function getWallet() {
    const pk = process.env.PRIVATE_KEY;
    if (!pk)
        throw new Error("PRIVATE_KEY missing in environment");
    return new ethers_1.ethers.Wallet(pk, getProvider());
}
function getContract(runner) {
    return new ethers_1.ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, runner ?? getProvider());
}
exports.hotelFactory = {
    getContract,
    getWallet,
    getProvider,
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
};
//# sourceMappingURL=hotelFactory.js.map