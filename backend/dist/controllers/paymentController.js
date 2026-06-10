"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPayment = exports.createPaymentIntent = void 0;
const database_1 = __importDefault(require("../config/database"));
const web3Service_1 = require("../services/web3Service");
const ethers_1 = require("ethers");
const bookingController_1 = require("./bookingController");
const createPaymentIntent = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ error: "Missing bookingId" });
        }
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        if (booking.status !== "PENDING") {
            return res.status(400).json({ error: "Booking not payable" });
        }
        const existingIntent = await database_1.default.payment.findFirst({
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
        const payment = await database_1.default.payment.create({
            data: {
                bookingId,
                amount: Number(booking.totalPrice),
                currency: "USDC",
                receiver: process.env.TREASURY_ADDRESS,
                status: "PENDING",
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        return res.json({
            success: true,
            intentId: payment.id,
            amount: payment.amount,
            receiver: payment.receiver,
            expiresAt: payment.expiresAt,
        });
    }
    catch (error) {
        console.error("Create intent error:", error);
        return res.status(500).json({ error: error.message });
    }
};
exports.createPaymentIntent = createPaymentIntent;
const confirmPayment = async (req, res) => {
    try {
        const { intentId, txHash } = req.body;
        if (!intentId || !txHash) {
            return res.status(400).json({ error: "Missing intentId or txHash" });
        }
        const payment = await database_1.default.payment.findUnique({
            where: { id: intentId },
        });
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
        const existingTx = await database_1.default.payment.findFirst({
            where: { txHash },
        });
        if (existingTx) {
            return res.status(400).json({ error: "Transaction already used" });
        }
        const result = await web3Service_1.web3Service.verifyStablecoinTransfer(txHash, ethers_1.ethers.parseUnits(payment.amount.toString(), 6), payment.receiver, {
            symbol: "USDC",
            address: process.env.USDC_ADDRESS.trim(),
            decimals: 6,
        });
        if (!result) {
            return res.status(400).json({ error: "Invalid or unverified transaction" });
        }
        await database_1.default.payment.update({
            where: { id: intentId },
            data: {
                txHash,
                status: "CONFIRMED",
            },
        });
        await (0, bookingController_1.confirmBookingPayment)({
            body: {
                bookingId: payment.bookingId,
                txHash,
            },
        }, res);
    }
    catch (error) {
        console.error("Confirm payment error:", error);
        return res.status(500).json({ error: error.message });
    }
};
exports.confirmPayment = confirmPayment;
//# sourceMappingURL=paymentController.js.map