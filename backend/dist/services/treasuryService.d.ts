export declare const treasuryService: {
    recordRevenue({ hotelAssetId, amount, tx, }: {
        hotelAssetId: string;
        amount: number;
        tx?: any;
    }): Promise<any>;
    getTotalTreasury(hotelAssetId?: string): Promise<number>;
    getHistory(hotelAssetId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        amount: number;
        hotelAssetId: string;
    }[]>;
};
//# sourceMappingURL=treasuryService.d.ts.map