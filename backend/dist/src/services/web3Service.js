"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Service = exports.Web3Service = void 0;
const ethers_1 = require("ethers");
const crypto_1 = require("crypto");
const KYC_CONTRACT_ABI = [
    "function submitKYC(uint8 level, bytes32 documentHash) external",
    "function approveKYC(address user, uint256 validityPeriod) external",
    "function rejectKYC(address user, string reason) external",
    "function isKYCValid(address user) external view returns (bool)",
    "function getKYCLevel(address user) external view returns (uint8)",
    "function getKYCRecord(address user) external view returns (tuple(uint8 level, uint8 status, uint256 approvedAt, uint256 expiresAt, bytes32 documentHash, address verifiedBy, string rejectionReason))",
    "event KYCSubmitted(address indexed user, uint8 level, bytes32 documentHash, uint256 timestamp)",
    "event KYCApproved(address indexed user, uint8 level, address indexed verifier, uint256 approvedAt, uint256 expiresAt)",
    "event KYCRejected(address indexed user, address indexed verifier, string reason, uint256 timestamp)",
];
class Web3Service {
    constructor() {
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL || "http://localhost:8545");
        this.signer = new ethers_1.ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
        this.contract = new ethers_1.ethers.Contract(process.env.KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, this.signer);
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
    async submitKYCOnChain(userAddress, kycLevel, documentHash) {
        try {
            const tx = await this.contract.submitKYC(kycLevel, documentHash);
            const receipt = await tx.wait();
            return receipt.hash;
        }
        catch (error) {
            console.error("Submit KYC on-chain error:", error);
            throw new Error(`Failed to submit KYC on-chain: ${error.message}`);
        }
    }
    async approveKYCOnChain(userAddress, validityPeriodDays = 365) {
        try {
            const validityPeriod = validityPeriodDays * 24 * 60 * 60;
            const tx = await this.contract.approveKYC(userAddress, validityPeriod);
            const receipt = await tx.wait();
            return receipt.hash;
        }
        catch (error) {
            console.error("Approve KYC on-chain error:", error);
            throw new Error(`Failed to approve KYC on-chain: ${error.message}`);
        }
    }
    async rejectKYCOnChain(userAddress, reason) {
        try {
            const tx = await this.contract.rejectKYC(userAddress, reason);
            const receipt = await tx.wait();
            return receipt.hash;
        }
        catch (error) {
            console.error("Reject KYC on-chain error:", error);
            throw new Error(`Failed to reject KYC on-chain: ${error.message}`);
        }
    }
    async isKYCValid(userAddress) {
        try {
            return await this.contract.isKYCValid(userAddress);
        }
        catch (error) {
            console.error("Check KYC validity error:", error);
            return false;
        }
    }
    async getKYCLevel(userAddress) {
        try {
            return await this.contract.getKYCLevel(userAddress);
        }
        catch (error) {
            console.error("Get KYC level error:", error);
            return 0;
        }
    }
    async getKYCRecord(userAddress) {
        try {
            const record = await this.contract.getKYCRecord(userAddress);
            return {
                level: Number(record.level),
                status: Number(record.status),
                approvedAt: Number(record.approvedAt),
                expiresAt: Number(record.expiresAt),
                documentHash: record.documentHash,
                verifiedBy: record.verifiedBy,
                rejectionReason: record.rejectionReason,
            };
        }
        catch (error) {
            console.error("Get KYC record error:", error);
            throw error;
        }
    }
    listenToKYCEvents() {
        this.contract.on("KYCSubmitted", (user, level, documentHash, timestamp) => {
            console.log("KYC Submitted:", {
                user,
                level: Number(level),
                documentHash,
                timestamp: new Date(Number(timestamp) * 1000),
            });
        });
        this.contract.on("KYCApproved", (user, level, verifier, approvedAt, expiresAt) => {
            console.log("KYC Approved:", {
                user,
                level: Number(level),
                verifier,
                approvedAt: new Date(Number(approvedAt) * 1000),
                expiresAt: new Date(Number(expiresAt) * 1000),
            });
        });
        this.contract.on("KYCRejected", (user, verifier, reason, timestamp) => {
            console.log("KYC Rejected:", {
                user,
                verifier,
                reason,
                timestamp: new Date(Number(timestamp) * 1000),
            });
        });
    }
    verifySignature(message, signature, address) {
        try {
            const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
            return recoveredAddress.toLowerCase() === address.toLowerCase();
        }
        catch (error) {
            console.error("Signature verification error:", error);
            return false;
        }
    }
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map