"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainKYC = void 0;
const KYCRegistry_json_1 = __importDefault(require("./abis/KYCRegistry.json"));
const KYCService_1 = __importDefault(require("../services/KYCService"));
class BlockchainKYC {
    constructor(address, publicClient, walletClient) {
        this.address = address;
        this.public = publicClient;
        this.wallet = walletClient;
    }
    async isVerified(userAddress) {
        try {
            const address = userAddress.toLowerCase();
            const result = await this.public.readContract({
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'isKYCVerified',
                args: [address],
            });
            return result;
        }
        catch (error) {
            console.error(' Error checking KYC verification:', error);
            throw error;
        }
    }
    async isPending(userAddress) {
        try {
            const address = userAddress.toLowerCase();
            const status = await this.public.readContract({
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'getKYCStatus',
                args: [address],
            });
            return status === 1;
        }
        catch (error) {
            console.error(' Error checking pending status:', error);
            throw error;
        }
    }
    async getVerificationTime(userAddress) {
        try {
            const address = userAddress.toLowerCase();
            const record = await this.public.readContract({
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'getKYCRecord',
                args: [address],
            });
            return record.approvedAt;
        }
        catch (error) {
            console.error(' Error getting verification time:', error);
            throw error;
        }
    }
    async verifyUser(userAddress) {
        try {
            console.log(' Approving KYC on blockchain:', userAddress);
            if (!userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
                throw new Error(`Invalid wallet address format: ${userAddress}`);
            }
            const address = userAddress.toLowerCase();
            const [account] = await this.wallet.getAddresses();
            const kycLevel = 1;
            const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);
            const documentHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
            const hash = await this.wallet.writeContract({
                account,
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'approveKYC',
                args: [address, kycLevel, expiresAt, documentHash],
                chain: this.wallet.chain,
            });
            console.log(' KYC approval transaction sent:', hash);
            const receipt = await this.public.waitForTransactionReceipt({ hash });
            if (receipt.status === 'success') {
                console.log(' KYC approved successfully:', receipt.transactionHash);
                return receipt.transactionHash;
            }
            else {
                throw new Error('KYC approval transaction failed');
            }
        }
        catch (error) {
            console.error(' Error approving KYC:', error);
            throw new Error(`Failed to approve KYC: ${error.message}`);
        }
    }
    async getKYCRecord(userAddress) {
        try {
            const address = userAddress.toLowerCase();
            const record = await this.public.readContract({
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'getKYCRecord',
                args: [address],
            });
            return record;
        }
        catch (error) {
            console.error(' Error getting KYC record:', error);
            throw error;
        }
    }
    async getKYCStatus(userAddress) {
        try {
            const address = userAddress.toLowerCase();
            const status = await this.public.readContract({
                address: this.address,
                abi: KYCRegistry_json_1.default,
                functionName: 'getKYCStatus',
                args: [address],
            });
            return status;
        }
        catch (error) {
            console.error(' Error getting KYC status:', error);
            throw error;
        }
    }
}
exports.BlockchainKYC = BlockchainKYC;
exports.default = KYCService_1.default;
//# sourceMappingURL=kyc.js.map