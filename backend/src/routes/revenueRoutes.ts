import express from "express";
import { getHotelRevenue, getQloHotelStats } from "../controllers/revenueController";

const router = express.Router();

router.get("/", getHotelRevenue);
router.get("/qlo/:hotelId", getQloHotelStats);

export default router;