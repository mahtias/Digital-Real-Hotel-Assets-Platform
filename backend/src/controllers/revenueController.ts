import { Request, Response } from "express";
import prisma from "../config/database";
import { qloService } from "../services/qloService";

export const getHotelRevenue = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const search = req.query.search as string;

    const hotelWhere: any = {};

    if (search) {
      hotelWhere.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [hotels, total] = await Promise.all([
      prisma.hotelAsset.findMany({
        where: hotelWhere,

        skip,
        take: limit,

        select: {
          id: true,
          name: true,
        },

        orderBy: {
          name: "asc",
        },
      }),

      prisma.hotelAsset.count({
        where: hotelWhere,
      }),
    ]);

    const hotelIds = hotels.map((h) => h.id);

    const [revenues, pendingSettlements, completedSettlements] =
      await Promise.all([
        prisma.booking.groupBy({
          by: ["hotelAssetId"],

          where: {
            hotelAssetId: {
              in: hotelIds,
            },
            status: "PAID",
          },

          _sum: {
            totalPrice: true,
            platformFee: true,
          },
        }),

        prisma.settlement.groupBy({
          by: ["hotelAssetId"],

          where: {
            hotelAssetId: {
              in: hotelIds,
            },
            status: "PENDING",
          },

          _sum: {
            amount: true,
          },
        }),

        prisma.settlement.groupBy({
          by: ["hotelAssetId"],

          where: {
            hotelAssetId: {
              in: hotelIds,
            },
            status: "COMPLETED",
          },

          _sum: {
            amount: true,
          },
        }),
      ]);

    const revenueMap = new Map(
      revenues.map((r) => [r.hotelAssetId, r])
    );

    const pendingMap = new Map(
      pendingSettlements.map((p) => [
        p.hotelAssetId,
        Number(p._sum.amount || 0),
      ])
    );

    const completedMap = new Map(
      completedSettlements.map((p) => [
        p.hotelAssetId,
        Number(p._sum.amount || 0),
      ])
    );

    const data = hotels.map((hotel) => {
      const revenue = revenueMap.get(hotel.id);

      const totalRevenue = Number(
        revenue?._sum.totalPrice || 0
      );

      const platformFees = Number(
        revenue?._sum.platformFee || 0
      );

      const investorYield = totalRevenue * 0.1;

      const hotelNetRevenue =
        totalRevenue -
        platformFees -
        investorYield;

      return {
        hotelId: hotel.id,
        hotelName: hotel.name,

        totalRevenue,

        platformFees,
        platformFeeRate: 0.05,

        investorYield,
        investorYieldRate: 0.1,

        hotelNetRevenue,

        pending:
          pendingMap.get(hotel.id) || 0,

        paid:
          completedMap.get(hotel.id) || 0,
      };
    });

    return res.json({
      success: true,

      data,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },

      filters: {
        search,
      },
    });

  } catch (err: any) {

    console.error("Revenue Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

export const getQloHotelStats = async (req: Request, res: Response) => {
  try {
    const qloHotelId = Number(req.params.hotelId);
    if (!qloHotelId) {
      return res.status(400).json({ success: false, message: "Invalid hotelId" });
    }

    const today = new Date();
    const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString().split("T")[0];
    const defaultTo = today.toISOString().split("T")[0];

    const dateFrom = (req.query.from as string) || defaultFrom;
    const dateTo   = (req.query.to   as string) || defaultTo;

    const stats = await qloService.getHotelStats(qloHotelId, dateFrom, dateTo);

    return res.json({ success: true, data: stats });
  } catch (err: any) {
    console.error("QloApps stats error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};