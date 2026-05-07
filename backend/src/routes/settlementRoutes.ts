import express from "express";
import { processSettlement,getSettlementHistory } from "../controllers/settlementController";

const router = express.Router();

// POST /api/v1/settlements/process/:hotelAssetId
router.post("/process/:hotelAssetId", processSettlement);
router.get("/history", getSettlementHistory);

export default router;