import { Request, Response } from 'express';
import prisma from '../config/database';
import { addDays } from "date-fns";

export const createStaking = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const userId = req.user.userId;
    const { stakedAmount, lockPeriodDays, apyRate, votingPowerMultiplier } = req.body;

    if (!stakedAmount || !lockPeriodDays || !apyRate) {
      return res.status(400).json({ message: "stakedAmount, lockPeriodDays, apyRate are required" });
    }

    const VALID_TIERS: Record<number, number> = { 30: 8, 90: 12, 180: 18, 365: 25 };
    const expectedApy = VALID_TIERS[Number(lockPeriodDays)];
    if (!expectedApy) {
      return res.status(400).json({ message: "Invalid lockPeriodDays. Allowed: 30, 90, 180, 365" });
    }
    if (Number(apyRate) !== expectedApy) {
      return res.status(400).json({ message: `Invalid apyRate for ${lockPeriodDays}-day lock. Expected ${expectedApy}%` });
    }

    const now = new Date();

    const stake = await prisma.staking.create({
      data: {
        userId,
        createdById: userId,
        stakedAmount: Number(stakedAmount),
        lockPeriodDays: Number(lockPeriodDays),
        apyRate: Number(apyRate),
        votingPowerMultiplier: Number(votingPowerMultiplier || 1),
        stakeStartDate: now,
        stakeEndDate: addDays(now, Number(lockPeriodDays)),
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
