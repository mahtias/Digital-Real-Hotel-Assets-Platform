import { ethers } from "ethers";
import { createHash } from "crypto";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import hatTokenAbi from "../../../out/HATToken.sol/HATToken.json";

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private kycContract: ethers.Contract;
  private hatContract: ethers.Contract;

  constructor() {
    // --------------------------
    // Provider
    // --------------------------
    const rpc = process.env.RPC_URL;
    if (!rpc) throw new Error(" Missing RPC_URL in .env");

    this.provider = new ethers.JsonRpcProvider(rpc);

    // --------------------------
    // Signer (choose MetaMask key)
    // --------------------------
    const privateKey =
      process.env.PRIVATE_KEY_METAMASK ||
      process.env.PRIVATE_KEY_COINBASE;

    if (!privateKey) {
      throw new Error(" Missing PRIVATE_KEY_METAMASK or PRIVATE_KEY_COINBASE in .env");
    }

    this.signer = new ethers.Wallet(privateKey, this.provider);

    // --------------------------
    // Contract: KYC Registry
    // --------------------------
    const kycAddress = process.env.KYC_CONTRACT_ADDRESS;
    if (!kycAddress) {
      throw new Error(" Missing KYC_CONTRACT_ADDRESS in .env");
    }

    this.kycContract = new ethers.Contract(
      kycAddress,
      kycRegistryAbi.abi,
      this.signer
    );

    // --------------------------
    // Contract: HAT Token
    // --------------------------
    const hatAddress = process.env.HAT_CONTRACT_ADDRESS;
    if (!hatAddress) {
      throw new Error(" Missing HAT_CONTRACT_ADDRESS in .env");
    }

    this.hatContract = new ethers.Contract(
      hatAddress,
      hatTokenAbi.abi,
      this.signer
    );
  }

  
  // HASHING
  
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

  
  // KYC CONTRACT FUNCTIONS
  
  async submitKYCOnChain(level: number, documentHash: string) {
    try {
      const tx = await this.kycContract.submitKYC(level, documentHash);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err: any) {
      console.error("Submit KYC error:", err);
      throw err;
    }
  }

  async approveKYCOnChain(user: string, validity: number) {
    try {
      const tx = await this.kycContract.approveKYC(user, validity);
      return (await tx.wait()).hash;
    } catch (err: any) {
      console.error("Approve KYC error:", err);
      throw err;
    }
  }

  async rejectKYCOnChain(user: string, reason: string) {
    try {
      const tx = await this.kycContract.rejectKYC(user, reason);
      return (await tx.wait()).hash;
    } catch (err: any) {
      console.error("Reject KYC error:", err);
      throw err;
    }
  }

  async getKYCRecord(user: string) {
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
    } catch (err) {
      console.error("Get KYC record error:", err);
      throw err;
    }
  }

  
  // HAT TOKEN / WHITELIST FUNCTIONS
  
  async whitelistUser(userAddress: string): Promise<string> {
    try {
      const tx = await this.hatContract.setWhitelisted(userAddress, true);
      return (await tx.wait()).hash;
    } catch (err: any) {
      console.error("Whitelist error:", err);
      throw err;
    }
  }

  async isUserWhitelisted(userAddress: string): Promise<boolean> {
    try {
      return await this.hatContract.isWhitelisted(userAddress);
    } catch (err) {
      console.error("Check whitelist error:", err);
      return false;
    }
  }

  async mintInvestmentTokens(
    hotelId: number,
    userAddress: string,
    tokenAmount: number
  ): Promise<string> {
    try {
      const tx = await this.hatContract.mintToInvestor(
        hotelId,
        userAddress,
        tokenAmount
      );
      return (await tx.wait()).hash;
    } catch (err) {
      console.error("Mint token error:", err);
      throw err;
    }
  }
}

export const web3Service = new Web3Service();