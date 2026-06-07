// backend/src/services/web3Service.ts

import { ethers } from "ethers";
import prisma from "../config/database";
import kycRegistryAbi from "../../../out/KYCRegistry.sol/KYCRegistry.json";
import hotelAssetManagerAbi from "../../../out/HotelAssetManager.sol/HotelAssetManager.json";
import hotelInvestmentAbi from "../../../out/HotelInvestment.sol/HotelInvestment.json";
import hotelAssetTokenAbi from "../../../out/HotelAssetToken.sol/HotelAssetToken.json";
//import { Stablecoin } from "../config/stablecoinRegistry";
import { StablecoinService } from "./stablecoinService";
// ============================================================
//  CONSTANTS & CONFIG
// ============================================================
const USDC_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const KYC_CONFIG = {
  LARGE_INVESTMENT_THRESHOLD: 1000, // $1000+ requires blockchain check
  BLOCKCHAIN_CACHE_HOURS: 24,       // Cache blockchain verification for 24h
  MAX_SYNC_ATTEMPTS: 3,             // Max retry attempts for blockchain sync
  SYNC_RETRY_DELAY: 5000,           // 5 seconds between retries
} as const;

const GAS_LIMITS = {
  KYC_REGISTER: 200000,
  INVESTMENT: 500000,
  TOKEN_TRANSFER: 100000,
} as const;

// ============================================================
//  WEB3 SERVICE CLASS
// ============================================================

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private kycContract: ethers.Contract;
  private hotelAssetManager: ethers.Contract;
  private hotelInvestment: ethers.Contract;

  // Cache for token contracts (avoid re-creating)
  private tokenContractCache: Map<string, ethers.Contract> = new Map();

  constructor() {
    this.provider = this.initializeProvider();
    this.signer = this.initializeSigner();
    this.kycContract = this.initializeKycContract();
    this.hotelAssetManager = this.initializeAssetManager();
    this.hotelInvestment = this.initializeInvestmentContract();
  }

   private async getReceiptWithRetry(txHash: string, retries = 5, delayMs = 2000) {
    for (let i = 0; i < retries; i++) {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (receipt) return receipt;
      console.log(`Receipt not found yet, retry ${i + 1}/${retries}`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
    return null;
  }

  // ============================================================
  //  INITIALIZATION (Private Methods)
  // ============================================================

  private initializeProvider(): ethers.JsonRpcProvider {
    const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
    if (!rpc) throw new Error(" Missing BASE_SEPOLIA_RPC or RPC_URL in .env");
    
    console.log(' Using RPC:', rpc);
    return new ethers.JsonRpcProvider(rpc);
  }

  private initializeSigner(): ethers.Wallet {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error(" Missing PRIVATE_KEY in .env");
    
    const signer = new ethers.Wallet(privateKey, this.provider);
    console.log(' Signer address:', signer.address);
    return signer;
  }

private initializeKycContract(): ethers.Contract {
  const address = process.env.KYC_CONTRACT_ADDRESS;

  if (!address) throw new Error(" Missing KYC_CONTRACT_ADDRESS in .env");

  const contract = new ethers.Contract(address, kycRegistryAbi.abi, this.signer);

  console.log(' KYC connected:', address);

  // 🔍 Debug contract functions
  console.log(
    "KYC Contract Functions:",
    contract.interface.fragments
      .filter((f: any) => f.type === "function")
      .map((f: any) => f.name)
  );

  // 🔍 Show exact approveKYC signature
  const approveFn = contract.interface.getFunction("approveKYC");
  console.log("approveKYC signature:", approveFn?.format());

  return contract;
}
     
  private initializeAssetManager(): ethers.Contract {
    const address = process.env.HOTEL_ASSET_MANAGER_ADDRESS;
    if (!address) throw new Error(" Missing HOTEL_ASSET_MANAGER_ADDRESS in .env");
    
    const contract = new ethers.Contract(address, hotelAssetManagerAbi.abi, this.signer);
    console.log(' HotelAssetManager connected:', address);
    return contract;
  }

  private initializeInvestmentContract(): ethers.Contract {
    const address = process.env.INVESTMENT_CONTRACT_ADDRESS;
    if (!address) throw new Error(" Missing INVESTMENT_CONTRACT_ADDRESS in .env");
    
    const contract = new ethers.Contract(address, hotelInvestmentAbi.abi, this.signer);
    console.log(' HotelInvestment connected:', address);
    return contract;
  }

  // ============================================================
  //  HYBRID KYC FUNCTIONS
  // ============================================================

  /**
   *  HYBRID: Check database first, verify blockchain for critical operations
   * @param address - User wallet address
   * @param forceBlockchainCheck - Force blockchain verification (for large investments)
   * @returns true if KYC verified
   */
  async isKycVerified(
    address: string,
    forceBlockchainCheck: boolean = false
  ): Promise<boolean> {
    try {
      const normalizedAddress = address.toLowerCase();
      console.log(` KYC Check for ${address}`);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  FAST CHECK: Database (Always)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const user = await prisma.user.findUnique({
        where: { walletAddress: normalizedAddress },
        select: {
          kycStatus: true,
          kycBlockchainSynced: true,
          kycLastVerified: true,
          kycApprovedAt: true
        }
      });

      if (user?.kycStatus !== 'APPROVED') {
        console.log('    Database: NOT APPROVED');
        return false;
      }

      console.log('    Database: APPROVED');

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  SMART CACHING: Check if recent verification exists
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      if (user.kycBlockchainSynced && user.kycLastVerified) {
        const hoursSinceVerification = 
          (Date.now() - user.kycLastVerified.getTime()) / (1000 * 60 * 60);

        if (hoursSinceVerification < KYC_CONFIG.BLOCKCHAIN_CACHE_HOURS && !forceBlockchainCheck) {
          console.log(` Using cached verification (${hoursSinceVerification.toFixed(1)}h old)`);
          return true;
        }
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  BLOCKCHAIN CHECK: For critical operations or expired cache
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      if (forceBlockchainCheck || !user.kycBlockchainSynced) {
        console.log('   Verifying on blockchain...');

        try {
          const onChainVerified = await this.kycContract.isKYCVerified(address);

          // Update database with blockchain result
          await prisma.user.update({
            where: { walletAddress: normalizedAddress },
            data: {
              kycBlockchainSynced: onChainVerified,
              kycLastVerified: new Date(),
              kycSyncError: null
            }
          });

          console.log(`   Blockchain: ${onChainVerified ? ' Verified' : ' Not Verified'}`);
          return onChainVerified;

        } catch (error: any) {
          console.warn('    Blockchain check failed:', error.message);
          
          // Record error but don't fail the check
          await prisma.user.update({
            where: { walletAddress: normalizedAddress },
            data: { kycSyncError: error.message }
          }).catch(() => {});

          // Fallback to database status if blockchain unavailable
          console.log('    Using database fallback');
          return true;
        }
      }

      return true; // Database says approved and cache is valid

    } catch (error: any) {
      console.error(' KYC check failed:', error.message);
      return false;
    }
  }

  /**
   *  Register user KYC on blockchain
   * @param address - User wallet address
   * @param hash - Document hash (IPFS CID or similar)
   * @returns Transaction hash
   */
async registerKyc(address: string, hash: string): Promise<string> {
  try {
    console.log(` Registering KYC for ${address}...`);

    const level = 1; // BASIC
    const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

    // Pre-flight checks
    const verifierRole = await this.kycContract.VERIFIER_ROLE();
    const hasRole = await this.kycContract.hasRole(verifierRole, this.signer.address);
    const paused = await this.kycContract.paused();
    console.log("Signer has VERIFIER_ROLE:", hasRole);
    console.log("KYC contract paused:", paused);

    if (!hasRole) throw new Error("Signer does not have VERIFIER_ROLE");
    if (paused) throw new Error("KYC contract is currently paused");

    // Approve KYC
    const tx = await this.kycContract.approveKYC(address, level, expiresAt, {
      gasLimit: GAS_LIMITS.KYC_REGISTER
    });

    console.log(" Tx sent:", tx.hash);
    const receipt = await tx.wait();
    console.log(" KYC approved on blockchain:", receipt.hash);

    await prisma.user.update({
      where: { walletAddress: address.toLowerCase() },
      data: {
        kycBlockchainTxHash: receipt.hash,
        kycBlockchainSynced: true,
        kycLastVerified: new Date(),
        kycSyncAttempts: 0,
        kycSyncError: null
      }
    });

    return receipt.hash;

  } catch (error: any) {
    console.error(" KYC registration failed:", error.message);

    await prisma.user.update({
      where: { walletAddress: address.toLowerCase() },
      data: {
        kycSyncAttempts: { increment: 1 },
        kycSyncError: error.message
      }
    }).catch(() => {});

    throw error;
  }
}


  /**
   *  Sync approved KYCs to blockchain (background job)
   */
async syncAllPendingKycs(): Promise<{ synced: number; failed: number }> {
  try {
    console.log('\nStarting bulk KYC sync to blockchain...');

    // Find all approved users not yet synced
    const pendingUsers = await prisma.user.findMany({
      where: {
        kycStatus: 'APPROVED',
        kycBlockchainSynced: false,
        walletAddress: { not: null },
      },
      select: {
        id: true,
        walletAddress: true,
        kycDocumentHash: true,
        email: true,
      },
    });

    if (pendingUsers.length === 0) {
      console.log('No pending KYC syncs needed');
      return { synced: 0, failed: 0 };
    }

    console.log(`Found ${pendingUsers.length} users to sync`);

    let synced = 0;
    let failed = 0;

    for (const user of pendingUsers) {
      if (!user.walletAddress) {
        console.log(`Skipping ${user.email}: No wallet address`);
        failed++;
        continue;
      }

      const hash =
        user.kycDocumentHash ||
        ethers.keccak256(ethers.toUtf8Bytes(`kyc-${user.id}-${Date.now()}`));

      console.log(`\nSyncing KYC for: ${user.email}`);
      console.log(`   Wallet: ${user.walletAddress}`);

      let attempts = 0;
      let txHash: string | null = null;

      while (attempts < 3 && !txHash) {
        attempts++;
        try {
          txHash = await this.registerKyc(user.walletAddress, hash);
        } catch (error: any) {
          console.warn(
            `Attempt ${attempts} failed for ${user.email}: ${error.message}`
          );
          if (attempts < 3) {
            await this.delay(2000); // wait before retry
          }
        }
      }

      if (!txHash) {
        console.error(`Failed to sync ${user.email} after 3 attempts`);
        failed++;
        continue;
      }

      // Update database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          kycBlockchainSynced: true,
          kycBlockchainTxHash: txHash,
          kycLastVerified: new Date(),
          kycDocumentHash: hash,
          updatedAt: new Date(),
        },
      });

      synced++;
      console.log(`Synced successfully (tx: ${txHash.slice(0, 10)}...)`);

      // Delay to avoid rate limiting
      await this.delay(2000);
    }

    console.log('\nBulk KYC sync completed:');
    console.log(`   ✓ Success: ${synced}`);
    console.log(`   ✗ Failed: ${failed}`);

    return { synced, failed };
  } catch (error: any) {
    console.error('Bulk KYC sync failed:', error.message);
    throw error;
  }
}


 /**
   * Delay execution (for rate limiting)
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // ============================================================
  //  HOTEL ASSET FUNCTIONS
  // ============================================================

  /**
   * Get hotel's ERC-20 token address from blockchain
   */
  async getHotelTokenAddress(hotelId: string): Promise<string> {
    try {
      const hotel = await prisma.hotelAsset.findUnique({
        where: { id: hotelId },
        select: { blockchainId: true, name: true }
      });

      if (!hotel?.blockchainId) {
        throw new Error(`Hotel ${hotelId} not found or not tokenized`);
      }

      // Get hotel data from blockchain
      const hotelData = await this.hotelAssetManager.getHotel(hotel.blockchainId);
      const tokenAddress = hotelData.tokenContract;

      if (tokenAddress === ethers.ZeroAddress) {
        throw new Error(`Hotel ${hotel.name} has no asset token deployed`);
      }

      console.log(` ${hotel.name} token address:`, tokenAddress);
      return tokenAddress;

    } catch (error: any) {
      console.error(' Get token address failed:', error.message);
      throw error;
    }
  }

  /**
   * Get hotel token contract instance (cached)
   */
  private async getHotelTokenContract(hotelId: string): Promise<ethers.Contract> {
    // Check cache first
    if (this.tokenContractCache.has(hotelId)) {
      return this.tokenContractCache.get(hotelId)!;
    }

    // Create new contract instance
    const tokenAddress = await this.getHotelTokenAddress(hotelId);
    const contract = new ethers.Contract(
      tokenAddress,
      hotelAssetTokenAbi.abi,
      this.signer
    );

    // Cache it
    this.tokenContractCache.set(hotelId, contract);
    return contract;
  }

  // ============================================================
  //  INVESTMENT FUNCTIONS
  // ============================================================

  /**
   *  Process investment with tiered KYC verification
   * @param hotelId - MongoDB ObjectId string
   * @param userAddress - Investor's wallet address
   * @param stableAmount - Amount in USDC (e.g., "100" for $100)
   * @returns Transaction hash
   */
  async processInvestment(
    hotelId: string,
    userAddress: string,
    stableAmount: string,
    paymentToken: string = "USDC"
  ): Promise<string> {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💰 PROCESSING INVESTMENT');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 1️⃣ Get Hotel Data
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const hotel = await prisma.hotelAsset.findUnique({
        where: { id: hotelId },
        select: {
          id: true,
          blockchainId: true,
          name: true,
          tokenPrice: true
        }
      });

      if (!hotel?.blockchainId) {
        throw new Error(`Hotel ${hotelId} not found`);
      }

      const amountUSD = parseFloat(stableAmount);
      console.log(` Hotel: ${hotel.name}`);
      console.log(` Investment: $${amountUSD} USDC`);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  TIERED KYC CHECK
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const requiresBlockchainCheck = amountUSD >= KYC_CONFIG.LARGE_INVESTMENT_THRESHOLD;
      
      if (requiresBlockchainCheck) {
        console.log(` Large investment ($${amountUSD}) - blockchain check required`);
      }

      const user = await prisma.user.findFirst({
        where: { walletAddress: userAddress },
        select: { id: true, kycStatus: true }
      });
            
            if (!user) {
        throw new Error('User not found');
      }
      console.log(`🔍 KYC Check for ${userAddress}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Database KYC: ${user.kycStatus}`);

            // Check database KYC status
      if (user.kycStatus !== 'APPROVED') {
        throw new Error('User must complete KYC verification first');
      }

      // For large investments, also check blockchain
      if (requiresBlockchainCheck) {
        const blockchainKYC = await this.isKycVerified(userAddress, true);
        console.log(`   Blockchain KYC: ${blockchainKYC ? 'VERIFIED' : 'NOT VERIFIED'}`);
        
        if (!blockchainKYC) {
          throw new Error('Large investment requires blockchain KYC verification');
        }
      }

      console.log('✅ KYC verification passed');

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  Calculate Expected Tokens
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const tokenAmount = amountUSD / Number(hotel.tokenPrice);
      console.log(` Expected tokens: ${tokenAmount.toFixed(2)}`);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          // 🏦 STABLECOIN INVESTMENT VALIDATION (STEP 2D-C)
          // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          StablecoinService.validateToken( paymentToken, "INVESTMENT");
          const stablecoin = StablecoinService.getStablecoin(paymentToken);

        const amountWei = ethers.parseUnits(stableAmount, stablecoin.decimals);

         console.log(` USDC (wei): ${amountWei.toString()}`);

          // 🔐 extra investment restriction check
          if (!stablecoin.allowInvestments) {
            throw new Error(`${stablecoin.symbol} is not allowed for investments`);
          }

          // 🏦 bank-grade restriction logic (important for HKMA future)
          if (stablecoin.complianceTier === "BANK_GRADE") {
            console.log("🏦 Bank-grade investment detected:", stablecoin.symbol);
          }

          console.log(" Stablecoin approved:", stablecoin.symbol);

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      //  Execute Investment Transaction
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      console.log(' Calling HotelInvestment.invest()...');

      const tx = await this.hotelInvestment.invest(
        hotel.blockchainId,
        amountWei,
        { gasLimit: GAS_LIMITS.INVESTMENT }
      );

      console.log('   Tx sent:', tx.hash);
      console.log('   Waiting for confirmation...');

      const receipt = await tx.wait();

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(' INVESTMENT SUCCESS!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(' Tx Hash:', receipt.hash);
      console.log(' Block:', receipt.blockNumber);
      console.log(' Gas Used:', receipt.gasUsed.toString());
      console.log(' Investor:', userAddress);
      console.log(' Hotel:', hotel.name);
      console.log(' USDC Invested:', stableAmount);
      console.log(' Tokens Minted:', tokenAmount.toFixed(2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return receipt.hash;

    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(' INVESTMENT FAILED!');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(' Error:', error.message);
      console.error(' Code:', error.code);

      // Enhanced error messages
      if (error.message.includes('KYCRequired')) {
        throw new Error('User must complete KYC verification first');
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient USDC balance or gas funds');
      }
      if (error.message.includes('InvestmentClosed')) {
        throw new Error('Investment period has ended for this hotel');
      }

      throw new Error(`Investment failed: ${error.message}`);
    }
  }

  // ============================================================
  //  BALANCE FUNCTIONS
  // ============================================================

  /**
   * Get user's token balance for a specific hotel (ERC-20)
   */
  async getHotelTokenBalance(userAddress: string, hotelId: string): Promise<string> {
    try {
      const hotel = await prisma.hotelAsset.findUnique({
        where: { id: hotelId },
        select: { name: true }
      });

      // Get the hotel's ERC-20 token contract (cached)
      const tokenContract = await this.getHotelTokenContract(hotelId);

      // ERC-20 balanceOf
      const balanceWei = await tokenContract.balanceOf(userAddress);

      // Convert from wei (18 decimals)
      const balance = ethers.formatUnits(balanceWei, 18);

      console.log(` Balance for ${userAddress}:`);
      console.log(`  Hotel: ${hotel?.name}`);
      console.log(`  Balance: ${balance} tokens`);

      return balance;

    } catch (error: any) {
      console.error(' Balance check failed:', error.message);
      return "0";
    }
  }

  /**
   * Get user's balances across all hotels (optimized)
   */
  async getAllHotelTokenBalances(userAddress: string): Promise<Record<string, string>> {
    try {
      // Get all tokenized hotels
      const hotels = await prisma.hotelAsset.findMany({
        where: { blockchainId: { gt: 0 } },
        select: {
          id: true,
          name: true,
          blockchainId: true
        }
      });

      console.log(` Checking balances for ${hotels.length} tokenized hotels`);

      const balances: Record<string, string> = {};

      // Process in parallel for speed
      const results = await Promise.allSettled(
        hotels.map(hotel => 
          this.getHotelTokenBalance(userAddress, hotel.id)
            .then(balance => ({ name: hotel.name, balance }))
        )
      );

      // Collect successful results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { name, balance } = result.value;
          if (parseFloat(balance) > 0) {
            balances[name] = balance;
            console.log(`  ${name}: ${balance}`);
          }
        } else {
          console.log(` ${hotels[index].name}: Could not fetch balance`);
        }
      });

      console.log(` Found ${Object.keys(balances).length} hotels with positive balances`);

      return balances;

    } catch (error: any) {
      console.error(' Get all balances failed:', error.message);
      return {};
    }
  }

  // ============================================================
  // 🛠️ UTILITY FUNCTIONS
  // ============================================================

  async getSignerAddress(): Promise<string> {
    return this.signer.address;
  }

  async getSignerBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.signer.address);
    return ethers.formatEther(balance);
  }

  async getNetworkInfo() {
    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId.toString(),
      name: network.name
    };
  }

  /**
   * Clear token contract cache (useful for testing)
   */
  clearTokenCache(): void {
    this.tokenContractCache.clear();
    console.log(' Token contract cache cleared');
  }

  ///verification trasanction hash for booking ///

public async verifyStablecoinTransfer(
    txHash: string,
  expectedAmount: bigint,
  expectedReceiver: string,
  stablecoin: {
    address: string;
    symbol: string;
    decimals: number;
  }
) {
  const receipt = await this.getReceiptWithRetry(txHash);

  if (!receipt) {
    console.error("Transaction receipt not found after retries");
    throw new Error("Transaction not found or not mined yet");
  }

  if (receipt.status !== 1) {
    console.error("Transaction receipt indicates failure", receipt);
    throw new Error("Transaction failed on-chain");
  }

  const stablecoinInterface  = new ethers.Interface(USDC_ABI);

  let foundAnyTransfer = false;
  let foundMatchingReceiver = false;

  for (const log of receipt.logs) {
    if (!log.address || log.address.toLowerCase() !== stablecoin.address.toLowerCase()) continue;

    try {
      const parsed = stablecoinInterface.parseLog(log);
      if (!parsed || parsed.name !== "Transfer") continue;

      const from = parsed.args.from;
      const to = parsed.args.to;
      const value = parsed.args.value as bigint;

      foundAnyTransfer = true;

      console.log(`${stablecoin.symbol} Transfer Found:`, {
        from,
        to,
        value: value.toString(),
        expectedAmount: expectedAmount.toString(),
      });

      if (to.toLowerCase() !== expectedReceiver.toLowerCase()) continue;

      foundMatchingReceiver = true;

      // ✅ Skip full amount check in development for testing
      if (process.env.NODE_ENV !== "development" && value < expectedAmount) {
        throw new Error(
          `Insufficient ${stablecoin.symbol} payment. Expected: ${expectedAmount.toString()}, Got: ${value.toString()}`
        );
      }

      // Successful verification
      return {
        sender: from,
        receiver: to,
        amount: value,
      };
    } catch (err: any) {
      console.warn("Failed to parse log:", err.message ?? err);
      continue;
    }
  }

  if (!foundAnyTransfer) {
   console.error(`No ${stablecoin.symbol} Transfer events found`);
   throw new Error( `No ${stablecoin.symbol} Transfer events found in transaction`);
  }

  if (!foundMatchingReceiver) {
    console.error(`${stablecoin.symbol} Transfer exists but not to expected receiver`, {
      expectedReceiver,
      logs: receipt.logs,
    });
    throw new Error(`${stablecoin.symbol} Transfer found, but not sent to expected receiver`);
  }
  
  throw new Error(`${stablecoin.symbol} transfer verification failed`);
}


}


// ============================================================
//  EXPORT SINGLETON
// ============================================================

export const web3Service = new Web3Service();
