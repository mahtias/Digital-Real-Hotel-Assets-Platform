import { Router } from "express";
import {
  recordPerformance,
  getPerformanceHistory,
  getLatestPerformance,
  getAllHotelsPerformance,
} from "../controllers/performanceController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

// Admin — record + overview
router.post("/record", recordPerformance);
router.get("/all", getAllHotelsPerformance);

// Per-hotel (investor-facing)
router.get("/:hotelAssetId/history", getPerformanceHistory);
router.get("/:hotelAssetId/latest", getLatestPerformance);

export default router;
