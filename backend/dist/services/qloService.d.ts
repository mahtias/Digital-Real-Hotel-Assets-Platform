export declare class QloService {
    private apiKey;
    private apiUrl;
    private builder;
    createBookingInPMS(data: {
        email: string;
        firstName: string;
        lastName: string;
        amount: number;
        hotelId: number;
        roomTypeId: number;
        dateFrom: string;
        dateTo: string;
    }): Promise<any>;
    private ensureCustomer;
    private createCart;
    getHotelStats(hotelId: number, dateFrom: string, dateTo: string): Promise<{
        hotelId: number;
        dateFrom: string;
        dateTo: string;
        totalOrders: number;
        confirmedOrders: number;
        totalRevenue: number;
    }>;
    private parseResponse;
}
export declare const qloService: QloService;
//# sourceMappingURL=qloService.d.ts.map