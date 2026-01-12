import { Router } from "express";
import {
  getRewardsByUser,
  createReward,
  claimReward,
  getReward,
  deleteReward
} from "../controllers/esgRewardController";

const router = Router();

router.get("/", getRewardsByUser);        // GET /esg-rewards?email=
router.post("/", createReward);           // POST /esg-rewards
router.get("/:id", getReward);            // GET /esg-rewards/:id
router.patch("/:id/claim", claimReward);  // PATCH /esg-rewards/:id/claim
router.delete("/:id", deleteReward);      // DELETE /esg-rewards/:id

export default router;
