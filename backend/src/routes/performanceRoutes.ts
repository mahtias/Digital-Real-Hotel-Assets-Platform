import { Router } from "express";
import {
  recordPerformance,
  getPerformanceHistory,
  getLatestPerformance,
  getAllHotelsPerformance,
} from "../controllers/performanceController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// Admin — record + overview
router.post("/record", recordPerformance);
router.get("/all", getAllHotelsPerformance);

// Per-hotel (investor-facing)
router.get("/:hotelAssetId/history", getPerformanceHistory);
router.get("/:hotelAssetId/latest", getLatestPerformance);

export default router;
