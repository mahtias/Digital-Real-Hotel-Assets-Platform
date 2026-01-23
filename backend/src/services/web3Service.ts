import { ethers } from "ethers";
import { createHash } from "crypto";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import hatTokenAbi from "../../../out/HATToken.sol/HATToken.json";

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private kycContract: ethers.Contract | null;
  private hatContract: ethers.Contract | null;

  constructor() {
    // --------------------------
    // Provider
    // --------------------------
    const rpc = process.env.RPC_URL;
    if (!rpc) throw new Error(" Missing RPC_URL in .env");

    this.provider = new ethers.JsonRpcProvider(rpc);

    // --------------------------
    // Signer
    // --------------------------
    const privateKey =
      process.env.PRIVATE_KEY_METAMASK ||
      process.env.PRIVATE_KEY_COINBASE;

    if (!privateKey) {
      throw new Error(" Missing PRIVATE_KEY_METAMASK or PRIVATE_KEY_COINBASE in .env");
    }

    this.signer = new ethers.Wallet(privateKey, this.provider);

    // --------------------------
    // OPTIONAL: KYC Contract
    // --------------------------
    const kycAddress = process.env.KYC_CONTRACT_ADDRESS;

    if (!kycAddress) {
      console.warn("⚠️  No KYC_CONTRACT_ADDRESS provided. KYC blockchain features disabled.");
      this.kycContract = null;
    } else {
      this.kycContract = new ethers.Contract(
        kycAddress,
        kycRegistryAbi.abi,
        this.signer
      );
    }

    // --------------------------
        // OPTIONAL: HAT Token Contract
        // --------------------------
        const hatAddress = process.env.HAT_CONTRACT_ADDRESS;

        if (!hatAddress) {
          console.warn("⚠️  No HAT_CONTRACT_ADDRESS provided. Token + whitelist features disabled.");
          this.hatContract = null;
        } else {
          this.hatContract = new ethers.Contract(
            hatAddress,
            hatTokenAbi.abi,
            this.signer
          );
        }
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

      // --------------------------
      // KYC CONTRACT FUNCTIONS
      // --------------------------

      async submitKYCOnChain(level: number, documentHash: string) {
        if (!this.kycContract) throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.submitKYC(level, documentHash);
        return (await tx.wait()).hash;
      }

      async approveKYCOnChain(user: string, validity: number) {
        if (!this.kycContract) throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.approveKYC(user, validity);
        return (await tx.wait()).hash;
      }

      async rejectKYCOnChain(user: string, reason: string) {
        if (!this.kycContract) throw new Error("KYC smart contract not configured");
        const tx = await this.kycContract.rejectKYC(user, reason);
        return (await tx.wait()).hash;
      }

      async getKYCRecord(user: string) {
        if (!this.kycContract) return null;
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

      // --------------------------
      // HAT TOKEN FUNCTIONS
      // --------------------------

      async whitelistUser(userAddress: string): Promise<string> {
        if (!this.hatContract) throw new Error("HAT token contract not configured");
        const tx = await this.hatContract.setWhitelisted(userAddress, true);
        return (await tx.wait()).hash;
      }

      async isUserWhitelisted(userAddress: string): Promise<boolean> {
        if (!this.hatContract) return false;
        return await this.hatContract.isWhitelisted(userAddress);
      }

      async mintInvestmentTokens(
        hotelId: number,
        userAddress: string,
        tokenAmount: number
      ): Promise<string> {
        if (!this.hatContract) throw new Error("HAT token contract not configured");
        const tx = await this.hatContract.mintToInvestor(
          hotelId,
          userAddress,
          tokenAmount
        );
        return (await tx.wait()).hash;
      }
    }

    export const web3Service = new Web3Service();
