import { Request, Response } from "express";
import prisma from "../config/database";
import hotelYieldVaultService from "../services/HotelYieldVaultService";

export const getVaultStats = async (
  req: Request,
  res: Response
) => {
  try {
    const stats =
      (await hotelYieldVaultService.getVaultStats()) as [bigint, bigint, bigint, bigint];

    return res.json({
      success: true,
      data: {
        totalDeposited:
          stats[0].toString(),
        totalAllocated:
          stats[1].toString(),
        totalClaimed:
          stats[2].toString(),
        vaultBalance:
          stats[3].toString(),
      },
    });
  } catch (error: any) {
    console.error(
      "Vault stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getClaimableYield = async (
  req: Request,
  res: Response
) => {
  try {
    const { wallet } = req.params;

    const amount =
      (await hotelYieldVaultService.getClaimableYield(
        wallet as `0x${string}`
      )) as bigint;

    return res.json({
      success: true,
      wallet,
      claimable: amount.toString(),
    });
  } catch (error: any) {
    console.error(
      "Claimable yield error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getYieldHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const yields =
      await prisma.investor_yields.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: "desc",
        },
      });

    return res.json({
      success: true,
      count: yields.length,
      data: yields,
    });
  } catch (error: any) {
    console.error(
      "Yield history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markClaimed = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, txHash } = req.body;

    const yieldRows = await prisma.investor_yields.findMany({
      where: { user_id: userId, status: "ALLOCATED" },
    });

    await prisma.investor_yields.updateMany({
      where: { user_id: userId, status: "ALLOCATED" },
      data: { status: "CLAIMED", tx_hash: txHash, paid_at: new Date() },
    });

    const earnedByInvestment = new Map<string, number>();
    for (const row of yieldRows) {
      if (row.investment_id) {
        earnedByInvestment.set(
          row.investment_id,
          (earnedByInvestment.get(row.investment_id) ?? 0) + Number(row.amount)
        );
      }
    }

    for (const [investmentId, earned] of earnedByInvestment) {
      await prisma.investment.update({
        where: { id: investmentId },
        data: { earnedRewards: { increment: earned }, pendingRewards: 0 },
      });
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const distributeYield = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      distributionId,
      investorWallet,
      amount
    } = req.body;

    const result =
      await hotelYieldVaultService.addClaimable(
        distributionId,
        investorWallet,
        BigInt(amount)
      );

    return res.json({
      success: true,
      hash: result.hash
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};