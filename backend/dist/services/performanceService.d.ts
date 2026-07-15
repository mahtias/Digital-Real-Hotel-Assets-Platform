export declare const performanceService: {
    recordPerformance(hotelAssetId: string, adminId: string, period?: string): Promise<{
        id: string;
        totalRevenue: import("@prisma/client-runtime-utils").Decimal;
        occupancyRate: number;
        revpar: number;
        hotelAssetId: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        qloRevenue: import("@prisma/client-runtime-utils").Decimal;
        bookingCount: number;
        investorYield: import("@prisma/client-runtime-utils").Decimal;
        recordedBy: string;
        recordedAt: Date;
    }>;
    getPerformanceHistory(hotelAssetId: string, limit?: number): Promise<{
        id: string;
        totalRevenue: import("@prisma/client-runtime-utils").Decimal;
        occupancyRate: number;
        revpar: number;
        hotelAssetId: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        qloRevenue: import("@prisma/client-runtime-utils").Decimal;
        bookingCount: number;
        investorYield: import("@prisma/client-runtime-utils").Decimal;
        recordedBy: string;
        recordedAt: Date;
    }[]>;
    getLatestPerformance(hotelAssetId: string): Promise<{
        id: string;
        totalRevenue: import("@prisma/client-runtime-utils").Decimal;
        occupancyRate: number;
        revpar: number;
        hotelAssetId: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        qloRevenue: import("@prisma/client-runtime-utils").Decimal;
        bookingCount: number;
        investorYield: import("@prisma/client-runtime-utils").Decimal;
        recordedBy: string;
        recordedAt: Date;
    } | null>;
    getAllHotelsPerformance(period?: string): Promise<({
        hotelAsset: {
            name: string;
            location: string;
        };
    } & {
        id: string;
        totalRevenue: import("@prisma/client-runtime-utils").Decimal;
        occupancyRate: number;
        revpar: number;
        hotelAssetId: string;
        period: string;
        periodStart: Date;
        periodEnd: Date;
        qloRevenue: import("@prisma/client-runtime-utils").Decimal;
        bookingCount: number;
        investorYield: import("@prisma/client-runtime-utils").Decimal;
        recordedBy: string;
        recordedAt: Date;
    })[]>;
};
//# sourceMappingURL=performanceService.d.ts.map