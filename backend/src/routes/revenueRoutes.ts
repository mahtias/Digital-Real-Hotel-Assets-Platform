import express from "express";
import { getHotelRevenue } from "../controllers/revenueController";

const router = express.Router();

router.get("/", getHotelRevenue);

export default router;