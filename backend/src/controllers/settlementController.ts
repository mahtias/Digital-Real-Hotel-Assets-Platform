import { Request, Response } from "express";
import prisma from "../config/database";
import { settlementService } from "../services/settlementService";

// ========================================
// 💸 PROCESS HOTEL SETTLEMENT
// ========================================
export const processSettlement = async (
  req: Request,
  res: Response
) => {
  try {
    const { hotelAssetId } = req.params;

    const result =
      await settlementService.processHotelPayout(
        hotelAssetId
      );

    return res.json({
      success: true,
      message: "Settlement processed",
      data: result,
    });

  } catch (err: any) {
    console.error("Settlement Error:", err);

    return res.status(500).json({
      success: false,
      message: "Settlement failed",
      error: err.message,
    });
  }
};

// ========================================
// 📜 GET ALL SETTLEMENT HISTORY
// ========================================
export const getSettlementHistory = async (
  req: Request,
  res: Response
) => {
  try {

    const settlements = await prisma.settlement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = await Promise.all(
      settlements.map(async (s) => {

        // HOTEL
        const hotel = await prisma.hotelAsset.findUnique({
          where: {
            id: s.hotelAssetId,
          },
          select: {
            name: true,
            location: true,
          },
        });

        // BOOKING
        const booking = await prisma.booking.findUnique({
          where: {
            id: s.bookingId,
          },
          select: {
            bookingCode: true,
          },
        });

        return {
          id: s.id,

          bookingCode: booking?.bookingCode,

          hotelName: hotel?.name,
          location: hotel?.location,

          amount: Number(s.amount),

          currency: s.currency,
          status: s.status,

          txHash: s.txHash,

          hotelWallet: s.hotelWallet,

          createdAt: s.createdAt,
        };
      })
    );

    return res.json(formatted);

  } catch (err: any) {

    console.error("Settlement History Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};