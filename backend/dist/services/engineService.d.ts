export declare class EngineService {
    private client;
    constructor();
    isEnabled(): boolean;
    writeContract(contractAddress: string, functionName: string, args: any[], gasLimit?: number): Promise<{
        queueId: string;
    }>;
    approveKYC(kycContractAddress: string, walletAddress: string, level: number, expiresAt: number): Promise<{
        queueId: string;
    }>;
    mintInvestment(tokenContractAddress: string, toAddress: string, amount: bigint): Promise<{
        queueId: string;
    }>;
    addClaimableBatch(vaultAddress: string, distributionIds: string[], investors: string[], amounts: bigint[]): Promise<{
        queueId: string;
    }>;
    getTransactionStatus(queueId: string): Promise<{
        queueId: string;
        status: any;
        txHash: any;
        error: any;
        minedAt: any;
    }>;
    waitForMine(queueId: string, maxAttempts?: number, delayMs?: number): Promise<{
        txHash: string;
    }>;
    listWallets(): Promise<any>;
    healthCheck(): Promise<boolean>;
}
export declare const engineService: EngineService;
//# sourceMappingURL=engineService.d.ts.map