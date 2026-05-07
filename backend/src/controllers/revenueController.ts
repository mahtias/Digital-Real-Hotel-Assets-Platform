import { Request, Response } from "express";
import prisma from "../config/database";

export const getHotelRevenue = async (
  req: Request,
  res: Response
) => {
  try {

    const data = await prisma.settlement.groupBy({
      by: ["hotelAssetId"],
      _sum: {
        amount: true,
      },
    });

    const enriched = await Promise.all(
      data.map(async (item) => {

        const hotel = await prisma.hotelAsset.findUnique({
          where: {
            id: item.hotelAssetId,
          },
        });

        const pending = await prisma.settlement.aggregate({
          where: {
            hotelAssetId: item.hotelAssetId,
            status: "PENDING",
          },
          _sum: {
            amount: true,
          },
        });

        const completed = await prisma.settlement.aggregate({
          where: {
            hotelAssetId: item.hotelAssetId,
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        });

        return {
          hotelId: item.hotelAssetId,
          hotelName: hotel?.name || "Unknown Hotel",

          totalRevenue:
            Number(item._sum.amount || 0),

          pending:
            Number(pending._sum.amount || 0),

          paid:
            Number(completed._sum.amount || 0),
        };
      })
    );

    return res.json(enriched);

  } catch (err: any) {

    console.error("Revenue Error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};