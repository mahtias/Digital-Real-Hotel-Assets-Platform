import dotenv from 'dotenv';
dotenv.config();
import { ethers } from 'ethers';
import HotelTokenFactoryABI from '../blockchain/abis/HotelTokenFactory.json';
import HotelAssetTokenABI from '../blockchain/abis/HotelAssetToken.json';
import { HotelTokenInfo, InvestorInfo } from '../types/hotel-token.types'; 

// Validate environment variables
function validateEnv() {
  const errors: string[] = [];

  if (!process.env.HOTEL_FACTORY_ADDRESS) {
    errors.push('HOTEL_FACTORY_ADDRESS not set in .env');
  }

  if (!process.env.BASE_SEPOLIA_RPC) {
    errors.push('BASE_SEPOLIA_RPC not set in .env');
  }

  if (!process.env.PRIVATE_KEY) {
    errors.push('PRIVATE_KEY not set in .env');
  } else {
    const pk = process.env.PRIVATE_KEY;
    if (!pk.startsWith('0x')) {
      errors.push('PRIVATE_KEY must start with 0x');
    } else if (pk.length !== 66) {
      errors.push(`PRIVATE_KEY must be 66 characters (0x + 64 hex), got ${pk.length}`);
    }
  }

  if (errors.length > 0) {
    throw new Error('Environment validation failed:\n' + errors.join('\n'));
  }
}

validateEnv();

const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS!;
const RPC_URL = process.env.BASE_SEPOLIA_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

// KYC Levels matching your Solidity enum
export enum KYCLevel {
  NONE = 0,
  BASIC = 1,
  ADVANCED = 2,
  INSTITUTIONAL = 3
}

interface DeploymentResult {
  tokenAddress: string;
  txHash: string;
  blockNumber: number;
}

interface DeployHotelTokenParams {
  hotelId: string;
  hotelName: string;
  location: string;
  symbol: string;
  maxSupply: number; // In tokens (will be converted to wei)
  priceUSD: number;
  admin: string;
  kycLevel?: KYCLevel; // Optional, uses default if not provided
}

class FactoryService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private factory: ethers.Contract;

  constructor() {
    try {
      this.provider = new ethers.JsonRpcProvider(RPC_URL);
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
      this.factory = new ethers.Contract(
        FACTORY_ADDRESS,
        HotelTokenFactoryABI.abi,
        this.wallet
      );
      console.log('✅ Factory service initialized');
      console.log('📍 Factory Address:', FACTORY_ADDRESS);
    } catch (error) {
      console.error('❌ Failed to initialize Factory Service:', error);
      throw error;
    }
  }

  /**
 * Deploy a new hotel token with all parameters
 */
async deployHotelToken(params: DeployHotelTokenParams): Promise<DeploymentResult> {
  try {
    console.log('🚀 Deploying hotel token:', params);

    const {
      hotelId,
      hotelName,
      location,
      symbol,
      maxSupply,
      priceUSD,
      admin,
      kycLevel
    } = params;

    let tx;

    if (kycLevel !== undefined) {
      // Deploy with specific KYC level
      // Cast to 'any' to bypass TypeScript checking
      tx = await (this.factory as any).deployHotelToken(
        hotelId,
        hotelName,
        location,
        symbol,
        maxSupply, // Contract handles conversion to wei
        priceUSD,
        admin,
        kycLevel
      );
    } else {
      // Deploy with default KYC level
      tx = await (this.factory as any).deployHotelTokenDefault(
        hotelId,
        hotelName,
        location,
        symbol,
        maxSupply,
        priceUSD,
        admin
      );
    }

    console.log('📝 Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

    // Find the TokenDeployed event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = this.factory.interface.parseLog({
          topics: log.topics as string[],
          data: log.data
        });
        return parsed?.name === 'TokenDeployed';
      } catch {
        return false;
      }
    });

    if (!event) {
      throw new Error('TokenDeployed event not found in transaction logs');
    }

    const parsed = this.factory.interface.parseLog({
      topics: event.topics as string[],
      data: event.data
    });
    
    const tokenAddress = parsed!.args[0]; // First argument is tokenAddress

    console.log('🎉 Token deployed at:', tokenAddress);

    return {
      tokenAddress,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error('❌ Error deploying hotel token:', error);
    throw error;
  }
}


  
  /**
   * Get all deployed token addresses
   * Matches contract function: getAllTokens()
   */
  async getAllTokens(): Promise<string[]> {
    try {
      return await this.factory.getAllTokens();
    } catch (error) {
      console.error('Error getting all tokens:', error);
      throw error;
    }
  }

  /**
   * Get token address for a specific hotel ID
   * Matches contract function: getTokenForHotel(string)
   */
  async getTokenForHotel(hotelId: string): Promise<string> {
    try {
      return await this.factory.getTokenForHotel(hotelId);
    } catch (error) {
      console.error('Error getting token for hotel:', error);
      throw error;
    }
  }

  /**
   * Get total number of deployed tokens
   * Matches contract function: getTotalDeployedTokens()
   */
  async getTotalDeployedTokens(): Promise<number> {
    try {
      const total = await this.factory.getTotalDeployedTokens();
      return Number(total);
    } catch (error) {
      console.error('Error getting total deployed tokens:', error);
      throw error;
    }
  }

  /**
   * Get KYC Registry address
   * Matches contract public variable: kycRegistry
   */
  async getKYCRegistry(): Promise<string> {
    try {
      return await this.factory.kycRegistry();
    } catch (error) {
      console.error('Error getting KYC registry:', error);
      throw error;
    }
  }

  /**
   * Get default KYC level
   * Matches contract public variable: defaultKYCLevel
   */
  async getDefaultKYCLevel(): Promise<KYCLevel> {
    try {
      return await this.factory.defaultKYCLevel();
    } catch (error) {
      console.error('Error getting default KYC level:', error);
      throw error;
    }
  }

  /**
   * Get token contract instance
   */
  getTokenContract(tokenAddress: string): ethers.Contract {
    return new ethers.Contract(
      tokenAddress,
      HotelAssetTokenABI.abi,
      this.wallet
    );
  }

  /**
   * Get factory address
   */
  getFactoryAddress(): string {
    return FACTORY_ADDRESS;
  }

  /**
   * Get factory owner
   */
  async getOwner(): Promise<string> {
    try {
      return await this.factory.owner();
    } catch (error) {
      console.error('Error getting owner:', error);
      throw error;
    }
  }

    /**
   * Get complete token information
   */
 async getCompleteTokenInfo(tokenAddress: string) {
  try {
    const token = this.getTokenContract(tokenAddress);
    
    // Get basic info that definitely exists
    const [
      name,
      symbol,
      decimals,
      totalSupply,
      hotelId,
      hotelName,
      location,
      maxSupply,
      tokenPriceUSD,
      deployedAt,
      paused
    ] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals(),
      token.totalSupply(),
      token.hotelId(),
      token.hotelName(),
      token.location(),
      token.maxSupply(),
      token.tokenPriceUSD(),
      token.deployedAt(),
      token.paused()
    ]);

    // Calculate remaining supply
    const remainingSupply = maxSupply - totalSupply;

    // Try to get optional fields
    let totalInvested = BigInt(0);
    let requiredKYCLevel = 0;

    try {
      totalInvested = await token.totalInvested();
    } catch (e) {
      // Field doesn't exist, use default
    }

    try {
      requiredKYCLevel = await token.requiredKYCLevel();
    } catch (e) {
      // Field doesn't exist, use default
    }

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply,
      hotelId,
      hotelName,
      location,
      maxSupply,
      remainingSupply,
      tokenPriceUSD: Number(tokenPriceUSD),
      totalInvested,
      requiredKYCLevel: Number(requiredKYCLevel),
      deployedAt: new Date(Number(deployedAt) * 1000),
      paused
    };
  } catch (error: any) {
    console.error('Error getting complete token info:', error.message);
    throw error;
  }
}


  /**
   * Get investor information for a specific address
   */
  async getInvestorInfo(tokenAddress: string, investorAddress: string): Promise<InvestorInfo> {
    try {
      const token = this.getTokenContract(tokenAddress);
      const info = await token.getInvestorInfo(investorAddress);
      
      return {
        investor: info.investor,
        amount: info.amount,
        timestamp: info.timestamp,
        kycLevel: info.kycLevel
      };
    } catch (error) {
      console.error('Error getting investor info:', error);
      throw error;
    }
  }

  /**
   * Calculate USD value for token amount
   */
  async calculateTokenValue(tokenAddress: string, tokenAmount: string): Promise<string> {
    try {
      const token = this.getTokenContract(tokenAddress);
      const amount = ethers.parseEther(tokenAmount);
      const usdValue = await token.calculateValue(amount);
      return ethers.formatUnits(usdValue, 0); // USD has no decimals in your contract
    } catch (error) {
      console.error('Error calculating token value:', error);
      throw error;
    }
  }

  async getTotalInvested(tokenAddress: string, investorAddress: string): Promise<bigint> {
  try {
    const token = this.getTokenContract(tokenAddress);
    const invested = await token.totalInvested(investorAddress);
    return invested;
  } catch (error) {
    console.error('Error getting total invested:', error);
    return 0n;
  }
}

/**
 * Get token balance for an address
 */
async getBalance(tokenAddress: string, address: string): Promise<bigint> {
  try {
    const token = this.getTokenContract(tokenAddress);
    const balance = await token.balanceOf(address);
    return balance;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0n;
  }
}

}

export default new FactoryService();
