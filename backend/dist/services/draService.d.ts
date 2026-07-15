declare class DRAService {
    private contract;
    private getContract;
    mintReward(toAddress: string, usdcAmount: number): Promise<string | null>;
    getBalance(address: string): Promise<number>;
    getStats(): Promise<{
        totalMinted: number;
        remaining: number;
        maxSupply: number;
    }>;
}
export declare const draService: DRAService;
export {};
//# sourceMappingURL=draService.d.ts.map