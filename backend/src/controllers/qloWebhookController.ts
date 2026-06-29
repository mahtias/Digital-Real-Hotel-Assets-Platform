import { Request, Response } from "express";
import prisma from "../config/database";
import { yieldService } from "../services/yieldService";

// Maps QloApps event types to platform BookingStatus
const EVENT_STATUS_MAP: Record<string, string> = {
  PAYMENT_CONFIRMED: "PAID",
  BOOKING_CONFIRMED: "CONFIRMED",
  GUEST_CHECKED_IN:  "CONFIRMED",
  BOOKING_COMPLETED: "COMPLETED",
  BOOKING_CANCELLED: "CANCELLED",
};

export const handleQloWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    console.log(" QloApps Webhook:", event);

    const { type, orderId, total_paid } = event;

    if (!EVENT_STATUS_MAP[type]) {
      return res.json({ message: `Ignored event: ${type}` });
    }

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" });
    }

    const booking = await prisma.booking.findFirst({
      where: { qloOrderId: String(orderId) },
    });

    if (!booking) {
      console.error(" Booking not found for Qlo order:", orderId);
      return res.status(404).json({ message: "Booking not found" });
    }

    // =========================================
    // UPDATE BOOKING STATUS
    // =========================================
    const newStatus = EVENT_STATUS_MAP[type];

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: newStatus as any },
    });

    console.log(` Booking ${booking.id} status → ${newStatus} (from QloApps event: ${type})`);

    // =========================================
    // YIELD DISTRIBUTION — only on PAYMENT_CONFIRMED
    // =========================================
    if (type === "PAYMENT_CONFIRMED") {
      const amount = Number(total_paid);

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Missing or invalid total_paid" });
      }

      const alreadyDistributed = await prisma.yield_distributions.findFirst({
        where: { booking_id: booking.id },
      });

      if (alreadyDistributed) {
        return res.json({ message: "Yield already processed", status: newStatus });
      }

      await yieldService.distributeFromBooking(booking.id, amount);
      console.log(" Yield distributed from QloApps PAYMENT_CONFIRMED");
    }

    return res.json({ success: true, status: newStatus });

  } catch (err: any) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
