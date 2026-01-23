"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.cancelBooking = exports.updateBookingStatus = exports.getBookingsByHotelAsset = exports.getUserBookings = exports.getBooking = exports.createBooking = void 0;
const database_1 = __importDefault(require("../config/database"));
function generateBookingCode() {
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `BKG-${new Date().getFullYear()}-${rand}`;
}
const createBooking = async (req, res) => {
    try {
        const { userId, hotelAssetId, checkInDate, checkOutDate, totalPrice, specialRequests, discountApplied, paymentMethod, guests, roomType } = req.body;
        if (!userId || !hotelAssetId || !checkInDate || !checkOutDate || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking fields"
            });
        }
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (checkOut <= checkIn) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date"
            });
        }
        const conflict = await database_1.default.booking.findFirst({
            where: {
                hotelAssetId,
                status: { not: "CANCELLED" },
                AND: [
                    { checkInDate: { lte: checkOut } },
                    { checkOutDate: { gte: checkIn } }
                ]
            }
        });
        if (conflict) {
            return res.status(409).json({
                success: false,
                message: "Selected dates are already booked"
            });
        }
        const newBooking = await database_1.default.booking.create({
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
                bookingCode: generateBookingCode()
            }
        });
        return res.json({
            success: true,
            message: "Booking created successfully",
            data: newBooking
        });
    }
    catch (err) {
        console.error("Create Booking Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: err.message
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
            orderBy: { createdAt: "desc" }
        });
        return res.json({
            success: true,
            data: bookings
        });
    }
    catch (err) {
        console.error("Get User Bookings Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user bookings",
            error: err.message
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
//# sourceMappingURL=bookingController.js.map