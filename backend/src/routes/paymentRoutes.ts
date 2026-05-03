import { Router } from "express";
import {
  createPaymentIntent,
  confirmPayment,
} from "../controllers/paymentController";

const router = Router();

// Create payment intent
router.post("/intent", createPaymentIntent);

// Confirm payment
router.post("/confirm", confirmPayment);

export default router;