import express from "express";
import {
  createBooking,
  createX402Booking,
  getBooking,
  getUserBookings,
  getBookingsByHotelAsset,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  confirmBookingPayment
} from "../controllers/bookingController";

import { authenticate } from "../middleware/auth";
import { x402Middleware } from "../middleware/x402";

const router = express.Router();

// Protect all routes that require user login
router.use(authenticate);

// Booking CRUD
router.post("/", createBooking);
router.post("/confirm-payment", confirmBookingPayment);

// x402 payment route — add ?pay=x402 to trigger x402 flow
// Price is dynamic per booking (passed as query param or default 1 USDC for the route guard)
router.post("/x402", x402Middleware(1), createX402Booking);

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
