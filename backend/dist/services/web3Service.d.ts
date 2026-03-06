export declare class Web3Service {
    private provider;
    private signer;
    private kycContract;
    private hotelAssetManager;
    private hotelInvestment;
    private tokenContractCache;
    constructor();
    private initializeProvider;
    private initializeSigner;
    private initializeKycContract;
    private initializeAssetManager;
    private initializeInvestmentContract;
    isKycVerified(address: string, forceBlockchainCheck?: boolean): Promise<boolean>;
    registerKyc(address: string, hash: string): Promise<string>;
    private registerKycWithRetry;
    syncAllPendingKycs(): Promise<{
        synced: number;
        failed: number;
    }>;
    private delay;
    getHotelTokenAddress(hotelId: string): Promise<string>;
    private getHotelTokenContract;
    processInvestment(hotelId: string, userAddress: string, usdcAmount: string): Promise<string>;
    getHotelTokenBalance(userAddress: string, hotelId: string): Promise<string>;
    getAllHotelTokenBalances(userAddress: string): Promise<Record<string, string>>;
    getSignerAddress(): Promise<string>;
    getSignerBalance(): Promise<string>;
    getNetworkInfo(): Promise<{
        chainId: string;
        name: string;
    }>;
    clearTokenCache(): void;
}
export declare const web3Service: Web3Service;
//# sourceMappingURL=web3Service.d.ts.map