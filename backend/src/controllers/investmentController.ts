import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";   
import { Prisma } from "@prisma/client";

// GET /api/investments
export const getUserInvestments = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { hotelAsset: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(investments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/investments
export const createInvestment = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { hotelId, amount, tokenAmount } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.walletAddress) {
      return res.status(400).json({ error: "User has no wallet connected" });
    }

    // 1. Ensure user is whitelisted on-chain
    const isWhitelisted = await web3Service.isUserWhitelisted(user.walletAddress);

    if (!isWhitelisted) {
      await web3Service.whitelistUser(user.walletAddress);
    }

    // 2. Mint investment tokens via HATToken contract
    const txHash = await web3Service.mintInvestmentTokens(
      hotelId,
      user.walletAddress,
      tokenAmount
    );

    // 3. Save investment record in DB
    const investment = await prisma.investment.create({
  data: {
    userId,
    hotelAssetId: hotelId,
    transactionHash: txHash,

    // Provided from request
    tokenAmount,
    amount,

    // Required Decimal defaults
    earnedRewards: new Prisma.Decimal(0),
    investedAmount: new Prisma.Decimal(amount),
    pendingRewards: new Prisma.Decimal(0),
    stakedAmount: new Prisma.Decimal(0),

    createdBy: userId,
    createdById: userId
  },
});

    res.json({
      success: true,
      investment,
      txHash
    });

  } catch (err) {
    console.error("Create investment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/investments/:id
export const getInvestmentById = async (req: Request, res: Response) => {
  try {
    const investment = await prisma.investment.findUnique({
      where: { id: req.params.id },
      include: { hotelAsset: true, user: true },
    });

    res.json(investment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/investments/:id
export const updateInvestment = async (req: Request, res: Response) => {
  try {
    const updated = await prisma.investment.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/investments/:id
export const deleteInvestment = async (req: Request, res: Response) => {
  try {
    await prisma.investment.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
