export declare class Web3Service {
    private provider;
    private contract;
    private signer;
    constructor();
    createDocumentHash(kycData: any): string;
    submitKYCOnChain(userAddress: string, kycLevel: number, documentHash: string): Promise<string>;
    approveKYCOnChain(userAddress: string, validityPeriodDays?: number): Promise<string>;
    rejectKYCOnChain(userAddress: string, reason: string): Promise<string>;
    isKYCValid(userAddress: string): Promise<boolean>;
    getKYCLevel(userAddress: string): Promise<number>;
    getKYCRecord(userAddress: string): Promise<any>;
    listenToKYCEvents(): void;
    verifySignature(message: string, signature: string, address: string): boolean;
}
export declare const web3Service: Web3Service;
//# sourceMappingURL=web3Service.d.ts.map