export declare const yieldService: {
    distributeFromBooking(bookingId: string, investorPoolAmount: number, stablecoinSymbol?: string, tx?: any): Promise<{
        distribution: any;
        distributed: boolean;
        totalInvested: number;
        investors: number;
        batchDistributionIds: string[];
        batchInvestors: `0x${string}`[];
        batchAmounts: bigint[];
        yieldRowsToUpdate: string[];
    } | {
        txHash: `0x${string}`;
        distribution: any;
        distributed: boolean;
        totalInvested: number;
        investors: number;
        batchDistributionIds: string[];
        batchInvestors: `0x${string}`[];
        batchAmounts: bigint[];
        yieldRowsToUpdate: string[];
    }>;
    distributePendingYields(): Promise<void>;
};
//# sourceMappingURL=yieldService.d.ts.map