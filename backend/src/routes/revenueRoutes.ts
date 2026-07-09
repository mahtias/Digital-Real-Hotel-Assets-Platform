import express from "express";
import { getHotelRevenue, getQloHotelStats } from "../controllers/revenueController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", getHotelRevenue);
router.get("/qlo/:hotelId", getQloHotelStats);

export default router;
