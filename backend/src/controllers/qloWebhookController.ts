import { Request, Response } from "express";
import prisma from "../config/database";
import { yieldService } from "../services/yieldService";

export const handleQloWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    console.log("📩 QloApps Webhook:", event);

    if (event.type !== "PAYMENT_CONFIRMED") {
      return res.json({ message: "Ignored event" });
    }

    const orderId = event.orderId;
    const amount = Number(event.total_paid);

    if (!orderId || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    //  FIX: match QloApps orderId
    const booking = await prisma.booking.findFirst({
      where: { qloOrderId: orderId },
    });

    if (!booking) {
      console.error("❌ Booking not found for Qlo order:", orderId);
      return res.status(404).json({ message: "Booking not found" });
    }

    const alreadyDistributed = await prisma.yield_distributions.findFirst({
      where: { booking_id: booking.id },
    });

    if (alreadyDistributed) {
      return res.json({ message: "Already processed" });
    }

    await yieldService.distributeFromBooking(
      booking.id,
      amount
    );

    console.log("✅ Yield distributed from QloApps");

    return res.json({ success: true });

  } catch (err: any) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: err.message });
  }
};