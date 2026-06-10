"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQloWebhook = void 0;
const database_1 = __importDefault(require("../config/database"));
const yieldService_1 = require("../services/yieldService");
const handleQloWebhook = async (req, res) => {
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
        const booking = await database_1.default.booking.findFirst({
            where: { qloOrderId: orderId },
        });
        if (!booking) {
            console.error("❌ Booking not found for Qlo order:", orderId);
            return res.status(404).json({ message: "Booking not found" });
        }
        const alreadyDistributed = await database_1.default.yield_distributions.findFirst({
            where: { booking_id: booking.id },
        });
        if (alreadyDistributed) {
            return res.json({ message: "Already processed" });
        }
        await yieldService_1.yieldService.distributeFromBooking(booking.id, amount);
        console.log("✅ Yield distributed from QloApps");
        return res.json({ success: true });
    }
    catch (err) {
        console.error("Webhook Error:", err);
        return res.status(500).json({ error: err.message });
    }
};
exports.handleQloWebhook = handleQloWebhook;
//# sourceMappingURL=qloWebhookController.js.map