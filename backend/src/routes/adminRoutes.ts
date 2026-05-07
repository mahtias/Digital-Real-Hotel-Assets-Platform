import express from "express";
import path from "path";
import {getAllBookingsAdmin} from "../controllers/bookingController";
//import { authenticate } from "../middleware/auth";

const router = express.Router();
//router.use(authenticate);
// Serve the Admin Settlements Page
router.get("/admin/settlements", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "adminSettlements.html"));
});
// ========================================
// 🏨 BOOKINGS
// ========================================
router.get("/bookings", getAllBookingsAdmin);

export default router;