"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hat = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const HATToken_json_1 = __importDefault(require("../../../out/HATToken.sol/HATToken.json"));
const hatAbi = HATToken_json_1.default.abi;
console.log("DEBUG PRIVATE KEY:", process.env.PRIVATE_KEY);
const HAT_CONTRACT = process.env.HAT_CONTRACT;
const account = (0, accounts_1.privateKeyToAccount)(process.env.PRIVATE_KEY);
exports.hat = {
    wallet: (0, viem_1.createWalletClient)({
        chain: chains_1.base,
        transport: (0, viem_1.http)(process.env.RPC_URL),
        account,
    }),
    public: (0, viem_1.createPublicClient)({
        chain: chains_1.base,
        transport: (0, viem_1.http)(process.env.RPC_URL),
    }),
    address: HAT_CONTRACT,
    abi: hatAbi,
};
//# sourceMappingURL=hat.js.map