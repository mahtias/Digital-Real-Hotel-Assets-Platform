interface BookingEmailProps {
    to: string;
    bookingCode: string;
    hotelName: string;
    hotelLocation?: string;
    hotelDescription?: string;
    checkIn: Date | string;
    checkOut: Date | string;
    total: number;
    txHash: string;
    attachInvoice?: boolean;
}
export declare function sendBookingEmail({ to, bookingCode, hotelName, hotelLocation, hotelDescription, checkIn, checkOut, total, txHash, attachInvoice }: BookingEmailProps): Promise<void>;
export {};
//# sourceMappingURL=sendBookingEmail.d.ts.map