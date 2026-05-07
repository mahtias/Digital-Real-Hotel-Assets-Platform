import express from "express";
import {
  createBooking,
  getBooking,
  getUserBookings,
  getBookingsByHotelAsset,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  confirmBookingPayment
} from "../controllers/bookingController";

import { authenticate } from "../middleware/auth";

const router = express.Router();

// Protect all routes that require user login
router.use(authenticate);

// Booking CRUD
router.post("/", createBooking);
router.post("/confirm-payment", confirmBookingPayment);

// User-specific bookings
router.get("/my", getUserBookings);

// Admin / asset-specific routes
router.get("/asset/:assetId", getBookingsByHotelAsset);
router.get("/:id", getBooking);

// Optional: Update / Cancel / Delete bookings
router.put("/:id/status", updateBookingStatus);
router.put("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);


export default router;
