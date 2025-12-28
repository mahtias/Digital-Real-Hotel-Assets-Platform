import { ethers } from "ethers";
import { createHash } from "crypto";

// KYC Contract ABI (add full ABI in production)
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

export class Web3Service {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private signer: ethers.Wallet;

  constructor() {
    // Initialize provider (use your RPC URL)
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || "http://localhost:8545"
    );

    // Initialize signer (admin wallet)
    this.signer = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY!,
      this.provider
    );

    // Initialize contract
    this.contract = new ethers.Contract(
      process.env.KYC_CONTRACT_ADDRESS!,
      KYC_CONTRACT_ABI,
      this.signer
    );
  }

  /**
   * Create document hash from KYC data
   */
  createDocumentHash(kycData: any): string {
    const dataString = JSON.stringify({
      fullName: kycData.fullName,
      dateOfBirth: kycData.dateOfBirth,
      nationality: kycData.nationality,
      idNumber: kycData.idNumber,
      idType: kycData.idType,
      timestamp: Date.now(),
    });

    return "0x" + createHash("sha256").update(dataString).digest("hex");
  }

  /**
   * Submit KYC to smart contract
   */
  async submitKYCOnChain(
    userAddress: string,
    kycLevel: number,
    documentHash: string
  ): Promise<string> {
    try {
      const tx = await this.contract.submitKYC(kycLevel, documentHash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error("Submit KYC on-chain error:", error);
      throw new Error(`Failed to submit KYC on-chain: ${error.message}`);
    }
  }

  /**
   * Approve KYC on smart contract
   */
  async approveKYCOnChain(
    userAddress: string,
    validityPeriodDays: number = 365
  ): Promise<string> {
    try {
      const validityPeriod = validityPeriodDays * 24 * 60 * 60; // Convert to seconds
      const tx = await this.contract.approveKYC(userAddress, validityPeriod);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error("Approve KYC on-chain error:", error);
      throw new Error(`Failed to approve KYC on-chain: ${error.message}`);
    }
  }

  /**
   * Reject KYC on smart contract
   */
  async rejectKYCOnChain(
    userAddress: string,
    reason: string
  ): Promise<string> {
    try {
      const tx = await this.contract.rejectKYC(userAddress, reason);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error("Reject KYC on-chain error:", error);
      throw new Error(`Failed to reject KYC on-chain: ${error.message}`);
    }
  }

  /**
   * Check if user has valid KYC on-chain
   */
  async isKYCValid(userAddress: string): Promise<boolean> {
    try {
      return await this.contract.isKYCValid(userAddress);
    } catch (error: any) {
      console.error("Check KYC validity error:", error);
      return false;
    }
  }

  /**
   * Get KYC level from smart contract
   */
  async getKYCLevel(userAddress: string): Promise<number> {
    try {
      return await this.contract.getKYCLevel(userAddress);
    } catch (error: any) {
      console.error("Get KYC level error:", error);
      return 0;
    }
  }

  /**
   * Get full KYC record from smart contract
   */
  async getKYCRecord(userAddress: string): Promise<any> {
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
    } catch (error: any) {
      console.error("Get KYC record error:", error);
      throw error;
    }
  }

  /**
   * Listen to KYC events
   */
  listenToKYCEvents() {
    // Listen to KYC Submitted events
    this.contract.on("KYCSubmitted", (user, level, documentHash, timestamp) => {
      console.log("KYC Submitted:", {
        user,
        level: Number(level),
        documentHash,
        timestamp: new Date(Number(timestamp) * 1000),
      });
    });

    // Listen to KYC Approved events
    this.contract.on(
      "KYCApproved",
      (user, level, verifier, approvedAt, expiresAt) => {
        console.log("KYC Approved:", {
          user,
          level: Number(level),
          verifier,
          approvedAt: new Date(Number(approvedAt) * 1000),
          expiresAt: new Date(Number(expiresAt) * 1000),
        });
      }
    );

    // Listen to KYC Rejected events
    this.contract.on("KYCRejected", (user, verifier, reason, timestamp) => {
      console.log("KYC Rejected:", {
        user,
        verifier,
        reason,
        timestamp: new Date(Number(timestamp) * 1000),
      });
    });
  }

  /**
   * Verify signature from frontend
   */
  verifySignature(message: string, signature: string, address: string): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }
}

export const web3Service = new Web3Service();
