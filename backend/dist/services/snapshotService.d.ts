export declare const snapshotService: {
    takeSnapshot(adminId: string, hotelAssetId?: string): Promise<{
        entries: {
            id: string;
            walletAddress: string;
            userId: string;
            tokenAmount: import("@prisma/client-runtime-utils").Decimal;
            hotelAssetId: string;
            investmentId: string;
            snapshotId: string;
        }[];
    } & {
        id: string;
        status: string;
        hotelAssetId: string | null;
        takenBy: string;
        takenAt: Date;
        totalEntries: number;
    }>;
    getLatestSnapshot(hotelAssetId: string): Promise<({
        entries: {
            id: string;
            walletAddress: string;
            userId: string;
            tokenAmount: import("@prisma/client-runtime-utils").Decimal;
            hotelAssetId: string;
            investmentId: string;
            snapshotId: string;
        }[];
    } & {
        id: string;
        status: string;
        hotelAssetId: string | null;
        takenBy: string;
        takenAt: Date;
        totalEntries: number;
    }) | null>;
    listSnapshots(hotelAssetId?: string): Promise<({
        _count: {
            entries: number;
        };
        hotelAsset: {
            name: string;
        } | null;
        takenByUser: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        status: string;
        hotelAssetId: string | null;
        takenBy: string;
        takenAt: Date;
        totalEntries: number;
    })[]>;
    getSnapshotById(snapshotId: string): Promise<({
        entries: {
            id: string;
            walletAddress: string;
            userId: string;
            tokenAmount: import("@prisma/client-runtime-utils").Decimal;
            hotelAssetId: string;
            investmentId: string;
            snapshotId: string;
        }[];
        hotelAsset: {
            name: string;
        } | null;
        takenByUser: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        status: string;
        hotelAssetId: string | null;
        takenBy: string;
        takenAt: Date;
        totalEntries: number;
    }) | null>;
};
//# sourceMappingURL=snapshotService.d.ts.map