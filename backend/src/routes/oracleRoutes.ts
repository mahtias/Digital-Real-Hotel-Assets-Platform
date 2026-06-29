import { Router } from "express";
import {
  requestPerformanceUpdate,
  getOnChainPerformance,
  getOnChainHotelData,
  getOracleStatus,
} from "../controllers/oracleController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/status", getOracleStatus);
router.post("/request-performance", requestPerformanceUpdate);
router.get("/performance/:hotelAssetId", getOnChainPerformance);
router.get("/hotel/:hotelAssetId", getOnChainHotelData);

export default router;
