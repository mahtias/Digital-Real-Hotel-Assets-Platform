import prisma from "../config/database";

export const snapshotService = {

  // =========================================
  //  TAKE SNAPSHOT
  // =========================================
  async takeSnapshot(adminId: string, hotelAssetId?: string) {
    const where: any = { status: "CONFIRMED" };
    if (hotelAssetId) where.hotelAssetId = hotelAssetId;

    const investments = await prisma.investment.findMany({
      where,
      include: { user: true },
    });

    if (investments.length === 0) {
      throw new Error(
        hotelAssetId
          ? `No confirmed investments found for hotel ${hotelAssetId}`
          : "No confirmed investments found"
      );
    }

    const snapshot = await prisma.snapshot.create({
      data: {
        takenBy: adminId,
        hotelAssetId: hotelAssetId ?? null,
        status: "ACTIVE",
        totalEntries: investments.length,
        entries: {
          create: investments.map((inv) => ({
            userId: inv.userId,
            investmentId: inv.id,
            walletAddress: inv.walletAddress ?? inv.user.walletAddress ?? "",
            tokenAmount: inv.tokenAmount,
            hotelAssetId: inv.hotelAssetId,
          })),
        },
      },
      include: { entries: true },
    });

    // Mark previous snapshots for the same scope as SUPERSEDED
    await prisma.snapshot.updateMany({
      where: {
        id: { not: snapshot.id },
        hotelAssetId: hotelAssetId ?? null,
        status: "ACTIVE",
      },
      data: { status: "SUPERSEDED" },
    });

    return snapshot;
  },

  // =========================================
  //  GET LATEST SNAPSHOT FOR A HOTEL
  // =========================================
  async getLatestSnapshot(hotelAssetId: string) {
    return prisma.snapshot.findFirst({
      where: { hotelAssetId, status: "ACTIVE" },
      orderBy: { takenAt: "desc" },
      include: { entries: true },
    });
  },

  // =========================================
  //  LIST ALL SNAPSHOTS
  // =========================================
  async listSnapshots(hotelAssetId?: string) {
    const where: any = {};
    if (hotelAssetId) where.hotelAssetId = hotelAssetId;

    return prisma.snapshot.findMany({
      where,
      orderBy: { takenAt: "desc" },
      include: {
        _count: { select: { entries: true } },
        hotelAsset: { select: { name: true } },
        takenByUser: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  },

  // =========================================
  //  GET SNAPSHOT BY ID
  // =========================================
  async getSnapshotById(snapshotId: string) {
    return prisma.snapshot.findUnique({
      where: { id: snapshotId },
      include: {
        entries: true,
        hotelAsset: { select: { name: true } },
        takenByUser: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  },
};
