import express from "express";
import { getAllBookingsAdmin } from "../controllers/bookingController";
import { getAdminUsers, getAdminInvestments } from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/bookings",     getAllBookingsAdmin);
router.get("/users",        getAdminUsers);
router.get("/investments",  getAdminInvestments);

export default router;
