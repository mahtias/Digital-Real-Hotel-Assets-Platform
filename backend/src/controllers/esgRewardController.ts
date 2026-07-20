import { Request, Response } from "express";
import prisma from "../config/database";
import { draService } from "../services/draService";

// GET /esg-rewards?email=
export const getRewardsByUser = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const rewards = await prisma.esgReward.findMany({
      where: { user_email: email },
      orderBy: { created_date: "desc" }
    });

    return res.json(rewards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST /esg-rewards
export const createReward = async (req: Request, res: Response) => {
  try {
    const { user_email, action_type, reward_amount } = req.body;

    const reward = await prisma.esgReward.create({
      data: {
        user_email,
        action_type,
        reward_amount,
        status: "pending"
      }
    });

    return res.json(reward);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// PATCH /esg-rewards/:id/claim
export const claimReward = async (req: Request, res: Response) => {
  try {
    const rewardId = req.params.id;

    const existing = await prisma.esgReward.findUnique({ where: { id: rewardId } });
    if (!existing) return res.status(404).json({ error: "Reward not found" });
    if (existing.status === "claimed") return res.status(400).json({ error: "Already claimed" });

    const reward = await prisma.esgReward.update({
      where: { id: rewardId },
      data: { status: "claimed" }
    });

    // Fire-and-forget DRA mint to user's wallet
    const user = await prisma.user.findFirst({
      where: { email: existing.user_email },
      select: { walletAddress: true }
    });
    if (user?.walletAddress) {
      draService.mintReward(user.walletAddress, existing.reward_amount).catch((err: any) => {
        console.error(`ESG DRA mint failed for ${existing.user_email}:`, err.message);
      });
    }

    return res.json(reward);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /esg-rewards/:id
export const getReward = async (req: Request, res: Response) => {
  try {
    const reward = await prisma.esgReward.findUnique({
      where: { id: req.params.id }
    });

    if (!reward) return res.status(404).json({ error: "Not found" });

    return res.json(reward);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE /esg-rewards/:id
export const deleteReward = async (req: Request, res: Response) => {
  try {
    await prisma.esgReward.delete({
      where: { id: req.params.id }
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};
