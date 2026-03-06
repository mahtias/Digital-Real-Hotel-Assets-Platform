export interface HotelTokenInfo {
  // ERC20 Standard
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  
  // Hotel Information
  hotelId: string;
  hotelName: string;
  location: string;
  maxSupply: bigint;
  remainingSupply: bigint;
  tokenPriceUSD: bigint;
  deployedAt: bigint;
  
  // Investment Stats
  totalInvested: bigint;
  
  // KYC Configuration
  kycRegistry: string;
  requiredKYCLevel: number;
  
  // Contract Status
  paused: boolean;
  
  // Contract Address
  tokenAddress: string;
}

export interface InvestorInfo {
  investor: string;
  amount: bigint;
  timestamp: bigint;
  kycLevel: number;
}

export interface TokenValueCalculation {
  tokenAmount: bigint;
  usdValue: bigint;
}

export interface DeployHotelTokenParams {
  hotelId: string;
  hotelName: string;
  location: string;
  symbol: string;
  maxSupply: number;
  priceUSD: number;
  admin: string;
  kycLevel: number;
}

export interface TokenDeploymentResult {
  tokenAddress: string;
  transactionHash: string;
  blockNumber: number;
}
