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
    private parseResponse;
}
export declare const qloService: QloService;
//# sourceMappingURL=qloService.d.ts.map