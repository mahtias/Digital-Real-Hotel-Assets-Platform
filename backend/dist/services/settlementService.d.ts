import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { Stablecoin } from "../config/stablecoinRegistry";
export declare const settlementService: {
    getTokenContract(stablecoin: Stablecoin): ethers.Contract;
    createSettlement(booking: any, currency?: string): Promise<{
        id: string;
        createdAt: Date | null;
        status: string;
        chainId: number | null;
        txHash: string | null;
        amount: Prisma.Decimal;
        stablecoinAddress: string | null;
        hotelAssetId: string;
        bookingId: string;
        hotelWallet: string;
        currency: string;
        failureReason: string | null;
        processedAt: Date | null;
        stablecoinSymbol: string | null;
        retryCount: number;
    }>;
    processHotelPayout(hotelAssetId: string, currency?: string): Promise<{
        success: boolean;
        message: string;
        hotelAssetId?: undefined;
        currency?: undefined;
        totalAmount?: undefined;
        txHash?: undefined;
        settlementCount?: undefined;
        hotelWallet?: undefined;
    } | {
        success: boolean;
        hotelAssetId: string;
        currency: string;
        totalAmount: number;
        txHash: any;
        settlementCount: number;
        hotelWallet: string;
        message?: undefined;
    }>;
    retryFailedPayouts(): Promise<{
        success: boolean;
        retried: number;
    }>;
    getTreasuryBalance(currency?: string): Promise<{
        currency: string;
        wallet: string;
        balance: string;
    }>;
    processAllPendingPayouts(): Promise<void>;
};
//# sourceMappingURL=settlementService.d.ts.map