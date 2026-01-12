import express from "express";
import {
  createBooking,
  getBooking,
  getUserBookings,
  getBookingsByHotelAsset,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
} from "../controllers/bookingController";

const router = express.Router();

router.post("/", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/asset/:assetId", getBookingsByHotelAsset);
router.get("/:id", getBooking);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);

export default router;
