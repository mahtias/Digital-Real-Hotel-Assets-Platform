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
            throw new Error(" Missing KYC_CONTRACT_ADDRESS in .env");
        }
        this.kycContract = new ethers_1.ethers.Contract(kycAddress, KYCRegistry_json_1.default.abi, this.signer);
        const hatAddress = process.env.HAT_CONTRACT_ADDRESS;
        if (!hatAddress) {
            throw new Error(" Missing HAT_CONTRACT_ADDRESS in .env");
        }
        this.hatContract = new ethers_1.ethers.Contract(hatAddress, HATToken_json_1.default.abi, this.signer);
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
        try {
            const tx = await this.kycContract.submitKYC(level, documentHash);
            const receipt = await tx.wait();
            return receipt.hash;
        }
        catch (err) {
            console.error("Submit KYC error:", err);
            throw err;
        }
    }
    async approveKYCOnChain(user, validity) {
        try {
            const tx = await this.kycContract.approveKYC(user, validity);
            return (await tx.wait()).hash;
        }
        catch (err) {
            console.error("Approve KYC error:", err);
            throw err;
        }
    }
    async rejectKYCOnChain(user, reason) {
        try {
            const tx = await this.kycContract.rejectKYC(user, reason);
            return (await tx.wait()).hash;
        }
        catch (err) {
            console.error("Reject KYC error:", err);
            throw err;
        }
    }
    async getKYCRecord(user) {
        try {
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
        catch (err) {
            console.error("Get KYC record error:", err);
            throw err;
        }
    }
    async whitelistUser(userAddress) {
        try {
            const tx = await this.hatContract.setWhitelisted(userAddress, true);
            return (await tx.wait()).hash;
        }
        catch (err) {
            console.error("Whitelist error:", err);
            throw err;
        }
    }
    async isUserWhitelisted(userAddress) {
        try {
            return await this.hatContract.isWhitelisted(userAddress);
        }
        catch (err) {
            console.error("Check whitelist error:", err);
            return false;
        }
    }
    async mintInvestmentTokens(hotelId, userAddress, tokenAmount) {
        try {
            const tx = await this.hatContract.mintToInvestor(hotelId, userAddress, tokenAmount);
            return (await tx.wait()).hash;
        }
        catch (err) {
            console.error("Mint token error:", err);
            throw err;
        }
    }
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map