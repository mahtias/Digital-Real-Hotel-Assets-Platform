import express from "express";
import { processSettlement } from "../controllers/settlementController";

const router = express.Router();

// POST /api/v1/settlements/process/:hotelAssetId
router.post("/process/:hotelAssetId", processSettlement);

export default router;