import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";
import { ethers } from "ethers";

//  IMPORTANT: import your existing booking confirmation logic
import { confirmBookingPayment } from "./bookingController";

// -----------------------------
// CREATE PAYMENT INTENT (x402)
// -----------------------------
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "Missing bookingId" });
    }

    //  Fetch booking from DB (DO NOT TRUST FRONTEND)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ error: "Booking not payable" });
    }

    //  Prevent multiple active intents
    const existingIntent = await prisma.payment.findFirst({
      where: {
        bookingId,
        status: "PENDING",
      },
    });

    if (existingIntent) {
      return res.json({
        success: true,
        intentId: existingIntent.id,
        amount: existingIntent.amount,
        receiver: existingIntent.receiver,
        expiresAt: existingIntent.expiresAt,
      });
    }

    //  Create new payment intent
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: Number(booking.totalPrice),
        currency: "USDC",
        receiver: process.env.TREASURY_ADDRESS!,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });

    return res.json({
      success: true,
      intentId: payment.id,
      amount: payment.amount,
      receiver: payment.receiver,
      expiresAt: payment.expiresAt,
    });
  } catch (error: any) {
    console.error("Create intent error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// -----------------------------
// CONFIRM PAYMENT (x402)
// -----------------------------
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { intentId, txHash } = req.body;

    if (!intentId || !txHash) {
      return res.status(400).json({ error: "Missing intentId or txHash" });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: intentId },
    });

    //  Validate payment intent
    if (!payment) {
      return res.status(404).json({ error: "Payment intent not found" });
    }

    if (payment.status === "CONFIRMED") {
      return res.status(400).json({ error: "Payment already confirmed" });
    }

    if (!payment.expiresAt || new Date() > payment.expiresAt) {
      return res.status(400).json({ error: "Payment expired" });
    }

    if (!payment.receiver) {
      return res.status(400).json({ error: "Payment receiver missing" });
    }

    if (payment.currency !== "USDC") {
      return res.status(400).json({ error: "Unsupported currency" });
    }

    //  Prevent replay attack
    const existingTx = await prisma.payment.findFirst({
      where: { txHash },
    });

    if (existingTx) {
      return res.status(400).json({ error: "Transaction already used" });
    }

    // 🔗 Verify blockchain payment
    const result = await web3Service.verifyStablecoinTransfer(
  txHash,
  ethers.parseUnits(payment.amount.toString(), 6),
  payment.receiver,
  {
    symbol: "USDC",
    address: process.env.USDC_ADDRESS!.trim(),
    decimals: 6,
  }
);

    if (!result) {
      return res.status(400).json({ error: "Invalid or unverified transaction" });
    }

    // ✅ Update payment record
    await prisma.payment.update({
      where: { id: intentId },
      data: {
        txHash,
        status: "CONFIRMED",
      },
    });

    // 🚀 IMPORTANT: reuse your existing booking logic
    await confirmBookingPayment(
      {
        body: {
          bookingId: payment.bookingId,
          txHash,
        },
      } as Request,
      res
    );

  } catch (error: any) {
    console.error("Confirm payment error:", error);
    return res.status(500).json({ error: error.message });
  }
};