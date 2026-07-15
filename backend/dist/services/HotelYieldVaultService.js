"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const viem_2 = require("viem");
const HotelYieldVault_json_1 = __importDefault(require("../../../out/HotelYieldVault.sol/HotelYieldVault.json"));
const engineService_1 = require("./engineService");
class HotelYieldVaultService {
    constructor() {
        const account = (0, accounts_1.privateKeyToAccount)(process.env.PRIVATE_KEY);
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.baseSepolia,
            transport: (0, viem_1.http)(process.env.RPC_URL),
        });
        this.walletClient = (0, viem_1.createWalletClient)({
            account,
            chain: chains_1.baseSepolia,
            transport: (0, viem_1.http)(process.env.RPC_URL),
        });
        const vaultAddress = process.env.HOTEL_YIELD_VAULT_ADDRESS;
        this.contract = (0, viem_1.getContract)({
            address: vaultAddress,
            abi: HotelYieldVault_json_1.default.abi,
            client: {
                public: this.publicClient,
                wallet: this.walletClient,
            },
        });
    }
    async getVaultStats() {
        return await this.contract.read.getVaultStats();
    }
    async getClaimableYield(investor) {
        return await this.contract.read.getClaimableYield([
            investor,
        ]);
    }
    async addClaimable(distributionId, investor, amount) {
        const hash = await this.contract.write.addClaimable([
            (0, viem_2.keccak256)((0, viem_2.stringToHex)(distributionId)),
            investor,
            amount,
        ]);
        const receipt = await this.publicClient.waitForTransactionReceipt({
            hash,
        });
        return {
            hash,
            receipt,
        };
    }
    async addClaimableBatch(distributionIds, investors, amounts) {
        const ids = distributionIds.map(id => (0, viem_2.keccak256)((0, viem_2.stringToHex)(id)));
        const vaultAddress = process.env.HOTEL_YIELD_VAULT_ADDRESS;
        if (engineService_1.engineService.isEnabled()) {
            console.log(" Using thirdweb Engine for addClaimableBatch");
            const { queueId } = await engineService_1.engineService.addClaimableBatch(vaultAddress, ids, investors, amounts);
            console.log(" Engine queued yield batch tx:", queueId);
            const result = await engineService_1.engineService.waitForMine(queueId);
            return { hash: result.txHash, receipt: { status: "success" } };
        }
        const hash = await this.contract.write.addClaimableBatch([ids, investors, amounts]);
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
        return { hash, receipt };
    }
    async claimYield() {
        const hash = await this.contract.write.claimYield();
        const receipt = await this.publicClient.waitForTransactionReceipt({
            hash,
        });
        return {
            hash,
            receipt,
        };
    }
}
exports.default = new HotelYieldVaultService();
//# sourceMappingURL=HotelYieldVaultService.js.map