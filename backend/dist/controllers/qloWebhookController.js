"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQloWebhook = void 0;
const database_1 = __importDefault(require("../config/database"));
const yieldService_1 = require("../services/yieldService");
const EVENT_STATUS_MAP = {
    PAYMENT_CONFIRMED: "PAID",
    BOOKING_CONFIRMED: "CONFIRMED",
    GUEST_CHECKED_IN: "CONFIRMED",
    GUEST_CHECKED_OUT: "COMPLETED",
    BOOKING_COMPLETED: "COMPLETED",
    BOOKING_CANCELLED: "CANCELLED",
};
const handleQloWebhook = async (req, res) => {
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
        const booking = await database_1.default.booking.findFirst({
            where: { qloOrderId: String(orderId) },
        });
        if (!booking) {
            console.error(" Booking not found for Qlo order:", orderId);
            return res.status(404).json({ message: "Booking not found" });
        }
        const newStatus = EVENT_STATUS_MAP[type];
        await database_1.default.booking.update({
            where: { id: booking.id },
            data: { status: newStatus },
        });
        console.log(` Booking ${booking.id} status → ${newStatus} (from QloApps event: ${type})`);
        if (type === "PAYMENT_CONFIRMED") {
            const amount = Number(total_paid);
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Missing or invalid total_paid" });
            }
            const alreadyDistributed = await database_1.default.yield_distributions.findFirst({
                where: { booking_id: booking.id },
            });
            if (alreadyDistributed) {
                return res.json({ message: "Yield already processed", status: newStatus });
            }
            await yieldService_1.yieldService.distributeFromBooking(booking.id, amount);
            console.log(" Yield distributed from QloApps PAYMENT_CONFIRMED");
        }
        return res.json({ success: true, status: newStatus });
    }
    catch (err) {
        console.error("Webhook Error:", err);
        return res.status(500).json({ error: err.message });
    }
};
exports.handleQloWebhook = handleQloWebhook;
//# sourceMappingURL=qloWebhookController.js.map