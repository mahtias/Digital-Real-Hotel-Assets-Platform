import { Request, Response } from "express";
import prisma from "../config/database";

export const getHotelRevenue = async (
  req: Request,
  res: Response
) => {
  try {

    // GROUP BY HOTEL
    const data = await prisma.booking.groupBy({

      by: ["hotelAssetId"],

      where: {
        status: "PAID",
      },

      _sum: {
        totalPrice: true,
        platformFee: true,
      },

    });

    const enriched = await Promise.all(

      data.map(async (item) => {

        // HOTEL INFO
        const hotel = await prisma.hotelAsset.findUnique({
          where: {
            id: item.hotelAssetId,
          },
        });

        // PENDING SETTLEMENTS
        const pending = await prisma.settlement.aggregate({
          where: {
            hotelAssetId: item.hotelAssetId,
            status: "PENDING",
          },
          _sum: {
            amount: true,
          },
        });

        // COMPLETED SETTLEMENTS
        const completed = await prisma.settlement.aggregate({
          where: {
            hotelAssetId: item.hotelAssetId,
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        });

        // TOTAL REVENUE
        const totalRevenue =
          Number(item._sum.totalPrice || 0);

        // PLATFORM FEES
        const platformFees =
          Number(item._sum.platformFee || 0);

        // INVESTOR YIELD (10%)
        const investorYield =
          totalRevenue * 0.10;

        // HOTEL NET REVENUE
        const hotelNetRevenue =
          totalRevenue -
          platformFees -
          investorYield;

       return {
              hotelId: item.hotelAssetId,
              hotelName: hotel?.name || "Unknown Hotel",

              totalRevenue,

              platformFees,
              platformFeeRate: 0.05, // 5% example (DEFINE YOUR RULE)

              investorYield,
              investorYieldRate: 0.10, // 10%

              hotelNetRevenue,

              pending: Number(pending._sum.amount || 0),
              paid: Number(completed._sum.amount || 0),
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