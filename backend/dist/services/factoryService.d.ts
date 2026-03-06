import { ethers } from 'ethers';
import { InvestorInfo } from '../types/hotel-token.types';
export declare enum KYCLevel {
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
    maxSupply: number;
    priceUSD: number;
    admin: string;
    kycLevel?: KYCLevel;
}
declare class FactoryService {
    private provider;
    private wallet;
    private factory;
    constructor();
    deployHotelToken(params: DeployHotelTokenParams): Promise<DeploymentResult>;
    getAllTokens(): Promise<string[]>;
    getTokenForHotel(hotelId: string): Promise<string>;
    getTotalDeployedTokens(): Promise<number>;
    getKYCRegistry(): Promise<string>;
    getDefaultKYCLevel(): Promise<KYCLevel>;
    getTokenContract(tokenAddress: string): ethers.Contract;
    getFactoryAddress(): string;
    getOwner(): Promise<string>;
    getCompleteTokenInfo(tokenAddress: string): Promise<{
        address: string;
        name: any;
        symbol: any;
        decimals: number;
        totalSupply: any;
        hotelId: any;
        hotelName: any;
        location: any;
        maxSupply: any;
        remainingSupply: number;
        tokenPriceUSD: number;
        totalInvested: bigint;
        requiredKYCLevel: number;
        deployedAt: Date;
        paused: any;
    }>;
    getInvestorInfo(tokenAddress: string, investorAddress: string): Promise<InvestorInfo>;
    calculateTokenValue(tokenAddress: string, tokenAmount: string): Promise<string>;
    getTotalInvested(tokenAddress: string, investorAddress: string): Promise<bigint>;
    getBalance(tokenAddress: string, address: string): Promise<bigint>;
}
declare const _default: FactoryService;
export default _default;
//# sourceMappingURL=factoryService.d.ts.map