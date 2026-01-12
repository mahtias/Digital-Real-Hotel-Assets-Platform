import express from "express";
import {
  createStaking,
  getUserStakings,
  claimStakingRewards,
  unstake
} from "../controllers/stakingController";
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post("/", authenticate, createStaking);

router.get("/me", authenticate, getUserStakings);

router.post("/:id/claim", authenticate, claimStakingRewards);

router.post("/:id/unstake", authenticate, unstake);

export default router;
