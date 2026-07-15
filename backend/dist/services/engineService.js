"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.engineService = exports.EngineService = void 0;
const axios_1 = __importDefault(require("axios"));
const ENGINE_URL = process.env.THIRDWEB_ENGINE_URL || "http://localhost:3005";
const ACCESS_TOKEN = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN || "";
const ENGINE_WALLET = process.env.THIRDWEB_ENGINE_WALLET_ADDRESS || "";
const CHAIN_ID = process.env.CHAIN_ID || "84532";
class EngineService {
    constructor() {
        this.client = axios_1.default.create({
            baseURL: ENGINE_URL,
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        });
    }
    isEnabled() {
        return process.env.USE_THIRDWEB_ENGINE === "true" &&
            !!ACCESS_TOKEN &&
            !!ENGINE_WALLET;
    }
    async writeContract(contractAddress, functionName, args, gasLimit) {
        const body = {
            functionName,
            args,
            backendWalletAddress: ENGINE_WALLET,
        };
        if (gasLimit) {
            body.txOverrides = { gasLimit: gasLimit.toString() };
        }
        const res = await this.client.post(`/contract/${CHAIN_ID}/${contractAddress}/write`, body);
        return { queueId: res.data.result.queueId };
    }
    async approveKYC(kycContractAddress, walletAddress, level, expiresAt) {
        return this.writeContract(kycContractAddress, "approveKYC", [walletAddress, level, expiresAt], 200000);
    }
    async mintInvestment(tokenContractAddress, toAddress, amount) {
        return this.writeContract(tokenContractAddress, "mintInvestment", [toAddress, amount.toString()], 500000);
    }
    async addClaimableBatch(vaultAddress, distributionIds, investors, amounts) {
        return this.writeContract(vaultAddress, "addClaimableBatch", [distributionIds, investors, amounts.map(a => a.toString())], 500000);
    }
    async getTransactionStatus(queueId) {
        const res = await this.client.get(`/transaction/status/${queueId}`);
        const tx = res.data.result;
        return {
            queueId,
            status: tx.status,
            txHash: tx.transactionHash ?? null,
            error: tx.errorMessage ?? null,
            minedAt: tx.minedAt ?? null,
        };
    }
    async waitForMine(queueId, maxAttempts = 30, delayMs = 3000) {
        for (let i = 0; i < maxAttempts; i++) {
            const status = await this.getTransactionStatus(queueId);
            if (status.status === "mined" && status.txHash) {
                return { txHash: status.txHash };
            }
            if (status.status === "errored") {
                throw new Error(`Engine transaction failed: ${status.error}`);
            }
            await new Promise(r => setTimeout(r, delayMs));
        }
        throw new Error(`Engine transaction timed out (queueId: ${queueId})`);
    }
    async listWallets() {
        const res = await this.client.get("/backend-wallet/get-all");
        return res.data.result ?? [];
    }
    async healthCheck() {
        try {
            await this.client.get("/health");
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.EngineService = EngineService;
exports.engineService = new EngineService();
//# sourceMappingURL=engineService.js.map