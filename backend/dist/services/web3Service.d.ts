export declare class Web3Service {
    private provider;
    private signer;
    private kycContract;
    private hatContract;
    private investmentContract?;
    constructor();
    isKycVerified(address: string): Promise<boolean>;
    mintInvestmentTokens(hotelId: string, userAddress: string, tokenAmount: number): Promise<string>;
}
export declare const web3Service: Web3Service;
//# sourceMappingURL=web3Service.d.ts.map