export declare class OracleService {
    private provider;
    private signer;
    private contract;
    constructor();
    requestPerformanceUpdate(hotelBlockchainId: number, apiUrl: string): Promise<{
        txHash: any;
        hotelBlockchainId: number;
        apiUrl: string;
    }>;
    requestHotelDataUpdate(hotelBlockchainId: number, apiUrl: string): Promise<{
        txHash: any;
        hotelBlockchainId: number;
        apiUrl: string;
    }>;
    getOnChainPerformance(hotelBlockchainId: number): Promise<{
        hotelBlockchainId: number;
        occupancyRate: number;
        revenue: number;
        revpar: number;
        bookingCount: number;
        period: string;
        lastUpdated: string | null;
        hasData: boolean;
    }>;
    getOnChainHotelData(hotelBlockchainId: number): Promise<{
        hotelBlockchainId: number;
        name: any;
        location: any;
        imageUrl: any;
        rooms: number;
        rating: number;
        lastUpdated: string | null;
        hasData: boolean;
    }>;
    isReady(): boolean;
}
export declare const oracleService: OracleService;
//# sourceMappingURL=oracleService.d.ts.map