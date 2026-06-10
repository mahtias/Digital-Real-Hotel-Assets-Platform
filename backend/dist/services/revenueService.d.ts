export declare const revenueService: {
    processBookingRevenue({ booking, paymentAmount, tx, }: {
        booking: any;
        paymentAmount: number;
        tx: any;
    }): Promise<{
        hotelShare: number;
        investorPool: number;
        platformFee: number;
    }>;
};
//# sourceMappingURL=revenueService.d.ts.map