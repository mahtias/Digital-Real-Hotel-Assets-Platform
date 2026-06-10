"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelFactory = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const HotelTokenFactory_json_1 = __importDefault(require("../../../out/HotelTokenFactory.sol/HotelTokenFactory.json"));
const hotelFactoryAbi = HotelTokenFactory_json_1.default.abi;
const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS;
function getWallet() {
    const pk = process.env.PRIVATE_KEY;
    if (!pk) {
        throw new Error("PRIVATE_KEY missing in environment");
    }
    const account = (0, accounts_1.privateKeyToAccount)(pk);
    return (0, viem_1.createWalletClient)({
        chain: chains_1.base,
        transport: (0, viem_1.http)(process.env.RPC_URL),
        account,
    });
}
exports.hotelFactory = {
    wallet: null,
    public: (0, viem_1.createPublicClient)({
        chain: chains_1.base,
        transport: (0, viem_1.http)(process.env.RPC_URL),
    }),
    address: FACTORY_ADDRESS,
    abi: hotelFactoryAbi,
    getWallet,
};
//# sourceMappingURL=hotelFactory.js.map