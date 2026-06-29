import { Router } from "express";

import {
  getVaultStats,
  getClaimableYield,
  getYieldHistory,
  markClaimed,
  distributeYield
} from "../controllers/yieldController";

const router = Router();

router.get(
  "/vault",
  getVaultStats
);

router.get(
  "/claimable/:wallet",
  getClaimableYield
);

router.get(
  "/history/:userId",
  getYieldHistory
);

router.post(
  "/mark-claimed",
  markClaimed
);

router.post(
  "/distribute",
  distributeYield
);

export default router;