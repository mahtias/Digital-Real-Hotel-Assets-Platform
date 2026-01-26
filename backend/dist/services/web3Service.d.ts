export declare class Web3Service {
    private provider;
    private signer;
    private kycContract;
    private hatContract;
    constructor();
    createDocumentHash(kycData: any): string;
    submitKYCOnChain(level: number, documentHash: string): Promise<any>;
    approveKYCOnChain(user: string, validity: number): Promise<any>;
    rejectKYCOnChain(user: string, reason: string): Promise<any>;
    getKYCRecord(user: string): Promise<{
        level: number;
        status: number;
        approvedAt: number;
        expiresAt: number;
        documentHash: any;
        verifiedBy: any;
        rejectionReason: any;
    }>;
    whitelistUser(userAddress: string): Promise<string>;
    isUserWhitelisted(userAddress: string): Promise<boolean>;
    mintInvestmentTokens(hotelId: number, userAddress: string, tokenAmount: number): Promise<string>;
}
export declare const web3Service: Web3Service;
//# sourceMappingURL=web3Service.d.ts.map