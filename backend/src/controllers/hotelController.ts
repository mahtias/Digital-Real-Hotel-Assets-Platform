import { Request, Response } from "express";
import prisma from '../config/database';

//const prisma = new PrismaClient();

// GET /api/hotels
export const getHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await prisma.hotelAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 6, // same as your React query
      select: {
        id: true,
        name: true,
        location: true,
        country: true,
        imageUrl: true,
        totalValue: true,
        tokenSymbol: true,
        totalTokens: true,
        tokensSold: true,
        tokenPrice: true,
        apy: true,
        occupancyRate: true,
        revpar: true,
        esgScore: true,
        roomCount: true,
        starRating: true,
        status: true,
        leaseEndDate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        createdById: true,
        createdBy: true,
        isSample: true,
      },
    });

    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: "Failed to load hotels" });
  }
};