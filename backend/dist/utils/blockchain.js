"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = void 0;
exports.verifyTransaction = verifyTransaction;
const ethers_1 = require("ethers");
const RPC_URL = process.env.BASE_SEPOLIA_RPC;
exports.provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
async function verifyTransaction(txHash) {
    const tx = await exports.provider.getTransactionReceipt(txHash);
    if (!tx) {
        throw new Error("Transaction not found");
    }
    if (tx.status !== 1) {
        throw new Error("Transaction failed");
    }
    return tx;
}
//# sourceMappingURL=blockchain.js.map