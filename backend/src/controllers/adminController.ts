import { Request, Response } from "express";
import prisma from "../config/database";

// GET /api/v1/admin/users
export const getAdminUsers = async (req: Request, res: Response) => {
  try {
    const page   = Math.max(1, Number(req.query.page)  || 1);
    const limit  = Math.max(1, Number(req.query.limit) || 20);
    const search = String(req.query.search || "").trim();
    const role   = String(req.query.role   || "").trim();
    const kyc    = String(req.query.kyc    || "").trim();

    const where: any = {};

    if (search) {
      where.OR = [
        { email:     { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName:  { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role      = role.toUpperCase();
    if (kyc)  where.kycStatus = kyc.toUpperCase();

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip:  (page - 1) * limit,
        take:  limit,
        orderBy: { createdAt: "desc" },
        select: {
          id:              true,
          email:           true,
          firstName:       true,
          lastName:        true,
          role:            true,
          kycStatus:       true,
          isEmailVerified: true,
          isActive:        true,
          walletAddress:   true,
          createdAt:       true,
          _count: {
            select: { investments: true, bookings: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      data: users,
      pagination: {
        total,
        totalPages,
        page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err: any) {
    console.error("getAdminUsers error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET /api/v1/admin/investments
export const getAdminInvestments = async (req: Request, res: Response) => {
  try {
    const page   = Math.max(1, Number(req.query.page)  || 1);
    const limit  = Math.max(1, Number(req.query.limit) || 20);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();

    const where: any = {
      NOT: { blockchainStatus: "DELETED" },
    };

    if (status) where.status = status.toUpperCase();

    if (search) {
      where.OR = [
        { user:      { email:     { contains: search, mode: "insensitive" } } },
        { user:      { firstName: { contains: search, mode: "insensitive" } } },
        { hotelAsset:{ name:      { contains: search, mode: "insensitive" } } },
      ];
    }

    const [investments, total, stats] = await Promise.all([
      prisma.investment.findMany({
        where,
        skip:  (page - 1) * limit,
        take:  limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, walletAddress: true },
          },
          hotelAsset: {
            select: { id: true, name: true, tokenSymbol: true, tokenPrice: true },
          },
        },
      }),
      prisma.investment.count({ where }),
      prisma.investment.aggregate({
        _sum:   { investedAmount: true },
        _count: { id: true },
        where:  { NOT: { blockchainStatus: "DELETED" } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      data: investments,
      stats: {
        totalInvestments: stats._count.id,
        totalInvested:    Number(stats._sum.investedAmount || 0),
      },
      pagination: {
        total,
        totalPages,
        page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err: any) {
    console.error("getAdminInvestments error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
