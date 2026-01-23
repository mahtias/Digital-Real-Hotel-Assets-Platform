"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Service = exports.Web3Service = void 0;
const ethers_1 = require("ethers");
const crypto_1 = require("crypto");
const KYCRegistry_json_1 = __importDefault(require("../../../out/KYCRegistry.sol/KYCRegistry.json"));
const HATToken_json_1 = __importDefault(require("../../../out/HATToken.sol/HATToken.json"));
class Web3Service {
    constructor() {
        const rpc = process.env.RPC_URL;
        if (!rpc)
            throw new Error(" Missing RPC_URL in .env");
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpc);
        const privateKey = process.env.PRIVATE_KEY_METAMASK ||
            process.env.PRIVATE_KEY_COINBASE;
        if (!privateKey) {
            throw new Error(" Missing PRIVATE_KEY_METAMASK or PRIVATE_KEY_COINBASE in .env");
        }
        this.signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
        const kycAddress = process.env.KYC_CONTRACT_ADDRESS;
        if (!kycAddress) {
            console.warn("  No KYC_CONTRACT_ADDRESS provided. KYC blockchain features disabled.");
            this.kycContract = null;
        }
        else {
            this.kycContract = new ethers_1.ethers.Contract(kycAddress, KYCRegistry_json_1.default.abi, this.signer);
        }
        const hatAddress = process.env.HAT_CONTRACT_ADDRESS;
        if (!hatAddress) {
            console.warn("  No HAT_CONTRACT_ADDRESS provided. Token + whitelist features disabled.");
            this.hatContract = null;
        }
        else {
            this.hatContract = new ethers_1.ethers.Contract(hatAddress, HATToken_json_1.default.abi, this.signer);
        }
    }
    createDocumentHash(kycData) {
        const dataString = JSON.stringify({
            fullName: kycData.fullName,
            dateOfBirth: kycData.dateOfBirth,
            nationality: kycData.nationality,
            idNumber: kycData.idNumber,
            idType: kycData.idType,
            timestamp: Date.now(),
        });
        return "0x" + (0, crypto_1.createHash)("sha256").update(dataString).digest("hex");
    }
    async submitKYCOnChain(level, documentHash) {
        if (!this.kycContract)
            throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.submitKYC(level, documentHash);
        return (await tx.wait()).hash;
    }
    async approveKYCOnChain(user, validity) {
        if (!this.kycContract)
            throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.approveKYC(user, validity);
        return (await tx.wait()).hash;
    }
    async rejectKYCOnChain(user, reason) {
        if (!this.kycContract)
            throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.rejectKYC(user, reason);
        return (await tx.wait()).hash;
    }
    async getKYCRecord(user) {
        if (!this.kycContract)
            return null;
        const r = await this.kycContract.getKYCRecord(user);
        return {
            level: Number(r.level),
            status: Number(r.status),
            approvedAt: Number(r.approvedAt),
            expiresAt: Number(r.expiresAt),
            documentHash: r.documentHash,
            verifiedBy: r.verifiedBy,
            rejectionReason: r.rejectionReason,
        };
    }
    async whitelistUser(userAddress) {
        if (!this.hatContract)
            throw new Error("HAT token contract not configured");
        const tx = await this.hatContract.setWhitelisted(userAddress, true);
        return (await tx.wait()).hash;
    }
    async isUserWhitelisted(userAddress) {
        if (!this.hatContract)
            return false;
        return await this.hatContract.isWhitelisted(userAddress);
    }
    async mintInvestmentTokens(hotelId, userAddress, tokenAmount) {
        if (!this.hatContract)
            throw new Error("HAT token contract not configured");
        const tx = await this.hatContract.mintToInvestor(hotelId, userAddress, tokenAmount);
        return (await tx.wait()).hash;
    }
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map