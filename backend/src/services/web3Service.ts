import { ethers } from "ethers";
import { createHash } from "crypto";
import prisma from "../config/database";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import hatTokenAbi from "../../../out/HATToken.sol/HATToken.json";
// ✅ ADD Investment ABI (create this file or use minimal ABI)
import investmentAbi from "../../../out/Investment.sol/Investment.json";

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private kycContract: ethers.Contract;
  private hatContract: ethers.Contract;
  private investmentContract?: ethers.Contract; // ✅ Optional

  constructor() {
    // --------------------------
    // Provider
    // --------------------------
    const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL!;
    if (!rpc) throw new Error("Missing BASE_SEPOLIA_RPC or RPC_URL in .env");

    console.log('🔗 Using RPC:', rpc);
    this.provider = new ethers.JsonRpcProvider(rpc);

    // --------------------------
    // Signer
    // --------------------------
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Missing PRIVATE_KEY in .env");
    }

    this.signer = new ethers.Wallet(privateKey, this.provider);

    // --------------------------
    // Contract: KYC Registry
    // --------------------------
    const kycAddress = process.env.KYC_CONTRACT_ADDRESS;
    if (!kycAddress) {
      throw new Error("Missing KYC_CONTRACT_ADDRESS in .env");
    }

    this.kycContract = new ethers.Contract(
      kycAddress,
      kycRegistryAbi.abi,
      this.signer
    );
    console.log('✅ KYC connected:', kycAddress);

    // --------------------------
    // Contract: HAT Token
    // --------------------------
    const hatAddress = process.env.HAT_CONTRACT_ADDRESS;
    if (!hatAddress) {
      throw new Error("Missing HAT_CONTRACT_ADDRESS in .env");
    }

    this.hatContract = new ethers.Contract(
      hatAddress,
      hatTokenAbi.abi,
      this.signer
    );
    console.log(' HAT connected:', hatAddress);

    // --------------------------
    // Contract: Investment (Optional)
    // --------------------------
    const investmentAddress = process.env.INVESTMENT_CONTRACT_ADDRESS;
    if (investmentAddress) {
      this.investmentContract = new ethers.Contract(
        investmentAddress,
        investmentAbi.abi,
        this.signer
      );
      console.log(' Investment connected:', investmentAddress);
    } else {
      console.warn(' No INVESTMENT_CONTRACT_ADDRESS → Direct HAT mint only');
    }
  }

  //  KYC Functions (use kycContract)
  async isKycVerified(address: string): Promise<boolean> {
    try {
      const verified = await this.kycContract.isKycVerified(address);
      return verified;
    } catch (error) {
      console.error('KYC check failed:', error);
      return false;
    }
  }

  //  FIXED mintInvestmentTokens → Smart fallback!
 async mintInvestmentTokens(hotelId: string, userAddress: string, tokenAmount: number): Promise<string> {
  console.log(' MINT DEBUG:', { hotelId, userAddress, tokenAmount });

  try {
    // 1. Network check
    const network = await this.provider.getNetwork();
    console.log(' Network:', network.chainId.toString());

    // 2.  FIXED: hotelId is already STRING (ObjectId)!
    const hotel = await prisma.hotelAsset.findUnique({ 
      where: { id: hotelId }  //  No parseInt!
    });
    if (!hotel) throw new Error(`Hotel ${hotelId} not found`);
    
    const tokenId = hotel.tokenId || BigInt(1);
    console.log(` Minting tokenId=${tokenId} → ${userAddress}`);

    let tx;

    // 3. Investment contract (hotelId as string → BigInt for contract)
    if (this.investmentContract) {
      try {
        console.log('💼 Using Investment contract → invest()');
        const usdcAmount = ethers.parseUnits((tokenAmount * Number(hotel.tokenPrice)).toString(), 6);
        tx = await this.investmentContract.invest(
          BigInt(hotel.tokenId!), // ✅ tokenId (number) → BigInt
          usdcAmount
        );
      } catch (invError) {
        console.log(' Investment failed → Direct HAT mint');
      }
    }

    // 4. HAT fallback
    if (!tx) {
      console.log(' Direct HAT mint');
      try {
        tx = await this.hatContract.mintToInvestor(tokenId, userAddress, tokenAmount);
      } catch {
        tx = await this.hatContract.mint(userAddress, tokenId, tokenAmount, "0x");
      }
    }

    const receipt = await tx.wait();
    console.log(' MINT SUCCESS:', receipt.hash);
    return receipt.hash;

  } catch (err: any) {
    console.error(' MINT FAILED:', err.message);
    throw new Error(`Mint failed: ${err.message}`);
  }
}

}

export const web3Service = new Web3Service();
