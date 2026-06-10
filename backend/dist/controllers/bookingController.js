"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsAdmin = exports.confirmBookingPayment = exports.deleteBooking = exports.cancelBooking = exports.updateBookingStatus = exports.getBookingsByHotelAsset = exports.getUserBookings = exports.getBooking = exports.createBooking = void 0;
const database_1 = __importDefault(require("../config/database"));
const web3Service_1 = require("../services/web3Service");
const sendBookingEmail_1 = require("../utils/sendBookingEmail");
const client_1 = require("@prisma/client");
const ethers_1 = require("ethers");
const qloService_1 = require("../services/qloService");
const settlementService_1 = require("../services/settlementService");
const stablecoinService_1 = require("../services/stablecoinService");
const yieldService_1 = require("../services/yieldService");
function generateBookingCode() {
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const year = new Date().getFullYear();
    return `DRA-BKG-${year}-${rand}`;
}
const createBooking = async (req, res) => {
    try {
        const { userId, hotelAssetId, checkInDate, checkOutDate, totalPrice, specialRequests, discountApplied, paymentMethod, guests, roomType, } = req.body;
        if (!userId || !hotelAssetId || !checkInDate || !checkOutDate || totalPrice === undefined || totalPrice === null) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking fields",
            });
        }
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (checkOut <= checkIn) {
            return res.status(400).json({
                success: false,
                message: "Check-out must be after check-in",
            });
        }
        const conflict = await database_1.default.booking.findFirst({
            where: {
                hotelAssetId,
                status: { not: "CANCELLED" },
                AND: [
                    { checkInDate: { lte: checkOut } },
                    { checkOutDate: { gte: checkIn } },
                ],
            },
        });
        if (conflict) {
            return res.status(409).json({
                success: false,
                message: "Dates already booked",
            });
        }
        const booking = await database_1.default.booking.create({
            data: {
                userId,
                hotelAssetId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice,
                specialRequests: specialRequests || null,
                discountApplied: discountApplied || null,
                paymentMethod: paymentMethod || null,
                guests,
                roomType,
                status: "PENDING",
                bookingCode: generateBookingCode(),
            },
        });
        return res.json({
            success: true,
            data: booking,
        });
    }
    catch (err) {
        console.error("Create Booking Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: err.message,
        });
    }
};
exports.createBooking = createBooking;
const getBooking = async (req, res) => {
    try {
        const booking = await database_1.default.booking.findUnique({
            where: { id: req.params.id }
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        return res.json({
            success: true,
            data: booking
        });
    }
    catch (err) {
        console.error("Get Booking Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
            error: err.message
        });
    }
};
exports.getBooking = getBooking;
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const bookings = await database_1.default.booking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        location: true,
                        description: true
                    },
                },
            },
        });
        return res.json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        console.error("Get User Bookings Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user bookings",
            error: err.message,
        });
    }
};
exports.getUserBookings = getUserBookings;
const getBookingsByHotelAsset = async (req, res) => {
    try {
        const bookings = await database_1.default.booking.findMany({
            where: { hotelAssetId: req.params.assetId },
            orderBy: { checkInDate: "asc" }
        });
        return res.json({
            success: true,
            data: bookings
        });
    }
    catch (err) {
        console.error("Get Asset Bookings Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch asset bookings",
            error: err.message
        });
    }
};
exports.getBookingsByHotelAsset = getBookingsByHotelAsset;
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await database_1.default.booking.update({
            where: { id: req.params.id },
            data: { status }
        });
        return res.json({
            success: true,
            message: "Booking status updated",
            data: updated
        });
    }
    catch (err) {
        console.error("Update Status Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update booking status",
            error: err.message
        });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const cancelBooking = async (req, res) => {
    try {
        const updated = await database_1.default.booking.update({
            where: { id: req.params.id },
            data: { status: "CANCELLED" }
        });
        return res.json({
            success: true,
            message: "Booking cancelled successfully",
            data: updated
        });
    }
    catch (err) {
        console.error("Cancel Booking Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel booking",
            error: err.message
        });
    }
};
exports.cancelBooking = cancelBooking;
const deleteBooking = async (req, res) => {
    try {
        await database_1.default.booking.delete({
            where: { id: req.params.id }
        });
        return res.json({
            success: true,
            message: "Booking deleted successfully"
        });
    }
    catch (err) {
        console.error("Delete Booking Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete booking",
            error: err.message
        });
    }
};
exports.deleteBooking = deleteBooking;
const confirmBookingPayment = async (req, res) => {
    try {
        const { bookingId, txHash, paymentToken = "USDC" } = req.body;
        if (!bookingId || !txHash) {
            return res.status(400).json({
                success: false,
                message: "Missing bookingId or txHash",
            });
        }
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
            include: { user: true, hotelAsset: true },
        });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        if (booking.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Booking already processed",
            });
        }
        const existingTx = await database_1.default.booking.findFirst({ where: { txHash } });
        if (existingTx) {
            return res.status(400).json({
                success: false,
                message: "Transaction already used",
            });
        }
        const stablecoin = stablecoinService_1.StablecoinService.getStablecoin(paymentToken);
        stablecoinService_1.StablecoinService.validateToken(paymentToken, "BOOKING");
        const expectedAmount = ethers_1.ethers.parseUnits(booking.totalPrice.toString(), stablecoin.decimals);
        const paymentValid = await web3Service_1.web3Service.verifyStablecoinTransfer(txHash, expectedAmount, process.env.TREASURY_ADDRESS, stablecoin);
        if (!paymentValid) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
        const result = await database_1.default.$transaction(async (tx) => {
            const paymentAmount = booking.totalPrice instanceof client_1.Prisma.Decimal
                ? booking.totalPrice.toNumber()
                : Number(booking.totalPrice);
            const platformFee = Number((paymentAmount * 0.10).toFixed(2));
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status: "PAID",
                    txHash,
                    walletAddress: paymentValid.sender,
                    paymentToken: stablecoin.symbol,
                    paymentStatus: "SUCCESS",
                    platformFee,
                },
            });
            const totalYield = paymentAmount * 0.20;
            await yieldService_1.yieldService.distributeFromBooking(updatedBooking.id, totalYield);
            const hotelShare = paymentAmount * 0.70;
            await settlementService_1.settlementService.createSettlement({
                ...updatedBooking,
                hotelAsset: booking.hotelAsset,
                totalPrice: hotelShare,
            });
            return { updatedBooking };
        });
        let pmsOrderDetails = null;
        try {
            const amountNumber = booking.totalPrice instanceof client_1.Prisma.Decimal
                ? booking.totalPrice.toNumber()
                : Number(booking.totalPrice);
            const ROOM_TYPE_MAP = {
                standard: 1,
                deluxe: 2,
                executive: 3,
                suite: 4,
            };
            const qloHotelId = booking.hotelAsset?.qloHotelId;
            const roomTypeId = ROOM_TYPE_MAP[booking.roomType];
            if (!roomTypeId || !qloHotelId)
                throw new Error("Missing QloApps mapping");
            pmsOrderDetails = await qloService_1.qloService.createBookingInPMS({
                email: booking.user.email,
                firstName: booking.user.firstName || "Web3",
                lastName: booking.user.lastName || "Investor",
                amount: amountNumber,
                hotelId: qloHotelId,
                roomTypeId,
                dateFrom: booking.checkInDate.toISOString().split("T")[0],
                dateTo: booking.checkOutDate.toISOString().split("T")[0],
            });
            console.log("Qlo PMS response:", JSON.stringify(pmsOrderDetails, null, 2));
            const qloOrderId = typeof pmsOrderDetails === "string" || typeof pmsOrderDetails === "number"
                ? pmsOrderDetails
                : pmsOrderDetails?.id ||
                    pmsOrderDetails?.id_order ||
                    pmsOrderDetails?.idOrder ||
                    pmsOrderDetails?.order_id ||
                    pmsOrderDetails?.orderId ||
                    pmsOrderDetails?.data?.id ||
                    pmsOrderDetails?.data?.id_order ||
                    pmsOrderDetails?.data?.idOrder ||
                    pmsOrderDetails?.data?.order_id ||
                    pmsOrderDetails?.data?.orderId ||
                    null;
            console.log("Extracted Qlo order id:", qloOrderId);
            await database_1.default.booking.update({
                where: { id: bookingId },
                data: {
                    qloOrderId: qloOrderId ? String(qloOrderId) : null,
                },
            });
        }
        catch (err) {
            console.error("❌ PMS Sync Failed:", err);
        }
        (async () => {
            try {
                await (0, sendBookingEmail_1.sendBookingEmail)({
                    to: booking.user.email,
                    bookingCode: booking.bookingCode,
                    hotelName: booking.hotelAsset?.name ?? "Hotel",
                    hotelLocation: booking.hotelAsset?.location ?? "",
                    hotelDescription: booking.hotelAsset?.description ?? "",
                    checkIn: booking.checkInDate,
                    checkOut: booking.checkOutDate,
                    total: Number(booking.totalPrice),
                    txHash,
                });
            }
            catch (err) {
                console.error("Email Error:", err);
            }
        })();
        return res.json({
            success: true,
            message: "Booking confirmed",
            data: {
                booking: result.updatedBooking,
                pmsSync: pmsOrderDetails ? "SUCCESS" : "FAILED",
            },
        });
    }
    catch (err) {
        console.error("Confirm Payment Error:", err);
        return res.status(500).json({
            success: false,
            message: "Payment confirmation failed",
            error: err.message,
        });
    }
};
exports.confirmBookingPayment = confirmBookingPayment;
const getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await database_1.default.booking.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        walletAddress: true,
                    },
                },
                hotelAsset: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                settlements: true,
            },
        });
        return res.json(bookings);
    }
    catch (err) {
        console.error("Admin Bookings Error:", err);
        return res.status(500).json({
            error: err.message,
        });
    }
};
exports.getAllBookingsAdmin = getAllBookingsAdmin;
//# sourceMappingURL=bookingController.js.map