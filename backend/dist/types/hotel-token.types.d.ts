export interface HotelTokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    hotelId: string;
    hotelName: string;
    location: string;
    maxSupply: bigint;
    remainingSupply: bigint;
    tokenPriceUSD: bigint;
    deployedAt: bigint;
    totalInvested: bigint;
    kycRegistry: string;
    requiredKYCLevel: number;
    paused: boolean;
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
//# sourceMappingURL=hotel-token.types.d.ts.map