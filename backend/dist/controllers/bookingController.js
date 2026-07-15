"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsAdmin = exports.confirmBookingPayment = exports.deleteBooking = exports.cancelBooking = exports.updateBookingStatus = exports.getBookingsByHotelAsset = exports.getUserBookings = exports.getBooking = exports.createX402Booking = exports.createBooking = void 0;
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
                roomType,
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
const createX402Booking = async (req, res) => {
    try {
        const x402Payment = req.x402Payment;
        if (!x402Payment) {
            return res.status(400).json({ success: false, message: "x402 payment info missing" });
        }
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const { hotelAssetId, checkInDate, checkOutDate, totalPrice, roomType, guests, specialRequests } = req.body;
        if (!hotelAssetId || !checkInDate || !checkOutDate || totalPrice === undefined) {
            return res.status(400).json({ success: false, message: "Missing required booking fields" });
        }
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        if (checkOut <= checkIn) {
            return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
        }
        const conflict = await database_1.default.booking.findFirst({
            where: {
                hotelAssetId,
                roomType,
                status: { not: "CANCELLED" },
                AND: [{ checkInDate: { lte: checkOut } }, { checkOutDate: { gte: checkIn } }],
            },
        });
        if (conflict) {
            return res.status(409).json({ success: false, message: "Dates already booked" });
        }
        const [user, hotelAsset] = await Promise.all([
            database_1.default.user.findUnique({ where: { id: userId } }),
            database_1.default.hotelAsset.findUnique({ where: { id: hotelAssetId } }),
        ]);
        if (!user || !hotelAsset) {
            return res.status(404).json({ success: false, message: "User or hotel not found" });
        }
        const paymentAmount = Number(totalPrice);
        const platformFee = Number((paymentAmount * 0.01).toFixed(2));
        const totalYield = paymentAmount * 0.20;
        const hotelShare = paymentAmount * 0.79;
        const txHash = x402Payment.txHash || `x402-${Date.now()}`;
        const booking = await database_1.default.booking.create({
            data: {
                userId,
                hotelAssetId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice,
                specialRequests: specialRequests || null,
                guests,
                roomType,
                paymentMethod: "x402",
                paymentToken: "USDC",
                paymentStatus: "SUCCESS",
                status: "PAID",
                txHash,
                walletAddress: user.walletAddress || null,
                platformFee,
                bookingCode: generateBookingCode(),
            },
        });
        await settlementService_1.settlementService.createSettlement({
            ...booking,
            hotelAsset,
            totalPrice: hotelShare,
        });
        yieldService_1.yieldService.distributeFromBooking(booking.id, totalYield, "USDC")
            .catch((err) => console.error(`x402 yield distribution failed for booking ${booking.id}:`, err.message));
        let pmsOrderDetails = null;
        try {
            const qloHotelId = hotelAsset.qloHotelId;
            let roomTypeId = null;
            const roomTypeLower = (roomType || "").toLowerCase().trim();
            if (Number(qloHotelId) === 1) {
                const map = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
                roomTypeId = map[roomTypeLower] ?? null;
            }
            else if (Number(qloHotelId) === 13 || Number(qloHotelId) === 14) {
                const map = { standard: 13, deluxe: 14, executive: 15, suite: 16 };
                roomTypeId = map[roomTypeLower] ?? null;
            }
            else {
                const ROOM_MAP = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
                roomTypeId = ROOM_MAP[roomTypeLower] ?? null;
            }
            console.log(`[x402 PMS] qloHotelId=${qloHotelId}, roomType="${roomType}", roomTypeLower="${roomTypeLower}", roomTypeId=${roomTypeId}`);
            if (!roomTypeId || !qloHotelId) {
                console.warn(`[x402 PMS] Skipping sync — missing mapping: qloHotelId=${qloHotelId}, roomTypeId=${roomTypeId}`);
            }
            else {
                pmsOrderDetails = await qloService_1.qloService.createBookingInPMS({
                    email: user.email,
                    firstName: user.firstName || "Web3",
                    lastName: user.lastName || "Investor",
                    amount: paymentAmount,
                    hotelId: qloHotelId,
                    roomTypeId,
                    dateFrom: checkIn.toISOString().split("T")[0],
                    dateTo: checkOut.toISOString().split("T")[0],
                });
                console.log("[x402 PMS] Qlo response:", JSON.stringify(pmsOrderDetails, null, 2));
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
                console.log("[x402 PMS] Extracted qloOrderId:", qloOrderId);
                if (qloOrderId) {
                    await database_1.default.booking.update({ where: { id: booking.id }, data: { qloOrderId: String(qloOrderId) } });
                    console.log(`[x402 PMS] Synced to QloApp: orderId=${qloOrderId}`);
                }
                else {
                    console.warn("[x402 PMS] QloApp responded but no order ID extracted");
                }
            }
        }
        catch (pmsErr) {
            console.error("[x402 PMS] Sync failed:", pmsErr.message);
        }
        (0, sendBookingEmail_1.sendBookingEmail)({
            to: user.email,
            bookingCode: booking.bookingCode,
            hotelName: hotelAsset.name,
            hotelLocation: hotelAsset.location ?? "",
            hotelDescription: hotelAsset.description ?? "",
            checkIn,
            checkOut,
            total: paymentAmount,
            txHash,
        }).catch((err) => console.error("x402 email error:", err.message));
        return res.json({
            success: true,
            message: "Booking confirmed via x402",
            data: {
                booking,
                pmsSync: pmsOrderDetails ? "SUCCESS" : "SKIPPED",
                txHash,
            },
        });
    }
    catch (err) {
        console.error("x402 Booking Error:", err);
        return res.status(500).json({ success: false, message: "x402 booking failed", error: err.message });
    }
};
exports.createX402Booking = createX402Booking;
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
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
        const skip = (page - 1) * limit;
        const [bookings, total] = await Promise.all([
            database_1.default.booking.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    hotelAsset: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                            location: true,
                            description: true,
                        },
                    },
                },
            }),
            database_1.default.booking.count({
                where: { userId },
            }),
        ]);
        return res.json({
            success: true,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
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
        const paymentAmount = booking.totalPrice instanceof client_1.Prisma.Decimal
            ? booking.totalPrice.toNumber()
            : Number(booking.totalPrice);
        const platformFee = Number((paymentAmount * 0.01).toFixed(2));
        const totalYield = paymentAmount * 0.20;
        const hotelShare = paymentAmount * 0.79;
        const result = await database_1.default.$transaction(async (tx) => {
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
            await settlementService_1.settlementService.createSettlement({
                ...updatedBooking,
                hotelAsset: booking.hotelAsset,
                totalPrice: hotelShare,
            });
            return { updatedBooking };
        });
        yieldService_1.yieldService.distributeFromBooking(result.updatedBooking.id, totalYield, "USDC")
            .catch((err) => {
            console.error(`Yield distribution failed for booking ${result.updatedBooking.id}, will retry:`, err.message);
        });
        let pmsOrderDetails = null;
        try {
            const amountNumber = booking.totalPrice instanceof client_1.Prisma.Decimal
                ? booking.totalPrice.toNumber()
                : Number(booking.totalPrice);
            const qloHotelId = booking.hotelAsset?.qloHotelId;
            const roomTypeLowerRegular = (booking.roomType || "").toLowerCase().trim();
            let roomTypeId = null;
            if (Number(qloHotelId) === 1) {
                const map = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
                roomTypeId = map[roomTypeLowerRegular] ?? null;
            }
            else if (Number(qloHotelId) === 13 || Number(qloHotelId) === 14) {
                const map = { standard: 13, deluxe: 14, executive: 15, suite: 16 };
                roomTypeId = map[roomTypeLowerRegular] ?? null;
            }
            else {
                const ROOM_TYPE_MAP = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
                roomTypeId = ROOM_TYPE_MAP[roomTypeLowerRegular] ?? null;
            }
            if (!roomTypeId || !qloHotelId)
                throw new Error(`Missing QloApps mapping for Hotel ${qloHotelId}, Room ${booking.roomType}`);
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
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const paymentStatus = req.query.paymentStatus;
        const hotelId = req.query.hotelId;
        const where = {};
        if (paymentStatus && paymentStatus !== "ALL") {
            where.paymentStatus = paymentStatus;
        }
        if (hotelId) {
            where.hotelAssetId = hotelId;
        }
        if (search) {
            where.OR = [
                {
                    bookingCode: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    user: {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    user: {
                        firstName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    user: {
                        lastName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    hotelAsset: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }
        const [bookings, total] = await Promise.all([
            database_1.default.booking.findMany({
                where,
                skip,
                take: limit,
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
                    settlements: {
                        select: {
                            id: true,
                            amount: true,
                            createdAt: true,
                        },
                    },
                },
            }),
            database_1.default.booking.count({
                where,
            }),
        ]);
        return res.json({
            success: true,
            count: bookings.length,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
            filters: {
                paymentStatus,
                hotelId,
                search,
            },
        });
    }
    catch (err) {
        console.error("Admin Bookings Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
exports.getAllBookingsAdmin = getAllBookingsAdmin;
//# sourceMappingURL=bookingController.js.map