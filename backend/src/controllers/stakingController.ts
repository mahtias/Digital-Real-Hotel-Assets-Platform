import { Request, Response } from 'express';
import prisma from '../config/database';
import { addDays } from "date-fns";

export const createStaking = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      stakedAmount,
      lockPeriodDays,
      apyRate,
      createdById
    } = req.body;

    const now = new Date();

    const stake = await prisma.staking.create({
      data: {
        userId,
        stakedAmount,
        lockPeriodDays,
        apyRate,
        stakeStartDate: now,
        stakeEndDate: addDays(now, lockPeriodDays),
        createdById
      }
    });

    return res.status(201).json(stake);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create staking" });
  }
};


export const getUserStakings = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const userId = req.user.userId;

    const stakings = await prisma.staking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json(stakings);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch stakings" });
  }
};


export const claimStakingRewards = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stake = await prisma.staking.findUnique({ where: { id } });

    if (!stake)
      return res.status(404).json({ message: "Stake not found" });

    const updated = await prisma.staking.update({
      where: { id },
      data: {
        claimedRewards: stake.claimedRewards + stake.earnedRewards,
        earnedRewards: 0,
        status: "REWARDED"
      }
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to claim rewards" });
  }
};


export const unstake = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stake = await prisma.staking.findUnique({ where: { id } });

    if (!stake)
      return res.status(404).json({ message: "Stake not found" });

    if (stake.status !== "ACTIVE")
      return res.status(400).json({ message: "Can only unstake ACTIVE stake" });

    const updated = await prisma.staking.update({
      where: { id },
      data: { status: "UNSTAKED" }
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to unstake" });
  }
};
