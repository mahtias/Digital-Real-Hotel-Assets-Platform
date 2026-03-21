import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";
import { sendBookingEmail } from "../utils/sendBookingEmail";
import { Prisma } from "@prisma/client"; 
import { ethers } from "ethers";
// Generate unique booking code
function generateBookingCode() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  const year = new Date().getFullYear();
  return `DRA-BKG-${year}-${rand}`;
}
console.log(" confirm-payment endpoint HIT"); 
// ------------------------------------
// CREATE BOOKING
// ------------------------------------

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      hotelAssetId,
      checkInDate,
      checkOutDate,
      totalPrice,
      specialRequests,
      discountApplied,
      paymentMethod,
      guests,
      roomType
    } = req.body;

    // Required fields check
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

    // Prevent overlapping bookings for same asset
    const conflict = await prisma.booking.findFirst({
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

    // Create booking ///
    const newBooking = await prisma.booking.create({
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

  } catch (err: any) {
    console.error("Create Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message
    });
  }
};

// ------------------------------------
// GET BOOKING BY ID
// ------------------------------------
export const getBooking = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
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

  } catch (err: any) {
    console.error("Get Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: err.message
    });
  }
};

// ------------------------------------
// GET BOOKINGS FOR LOGGED-IN USER
// ------------------------------------
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: bookings
    });

  } catch (err: any) {
    console.error("Get User Bookings Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
      error: err.message
    });
  }
};

// ------------------------------------
// GET BOOKINGS BY HOTEL ASSET
// ------------------------------------
export const getBookingsByHotelAsset = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { hotelAssetId: req.params.assetId },
      orderBy: { checkInDate: "asc" }
    });

    return res.json({
      success: true,
      data: bookings
    });

  } catch (err: any) {
    console.error("Get Asset Bookings Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch asset bookings",
      error: err.message
    });
  }
};

// ------------------------------------
// UPDATE BOOKING STATUS
// ------------------------------------
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });

    return res.json({
      success: true,
      message: "Booking status updated",
      data: updated
    });

  } catch (err: any) {
    console.error("Update Status Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: err.message
    });
  }
};

// ------------------------------------
// CANCEL BOOKING
// ------------------------------------
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" }
    });

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: updated
    });

  } catch (err: any) {
    console.error("Cancel Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: err.message
    });
  }
};

// ------------------------------------
// DELETE BOOKING
// ------------------------------------
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id }
    });

    return res.json({
      success: true,
      message: "Booking deleted successfully"
    });

  } catch (err: any) {
    console.error("Delete Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: err.message
    });
  }
};

// ------------------------------------
// CONFIRM BOOKING PAYMENT
// ------------------------------------

export const confirmBookingPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, txHash } = req.body;

    if (!bookingId || !txHash) {
      return res.status(400).json({ success: false, message: "Missing bookingId or txHash" });
    }

    // Find booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status !== "PENDING")
      return res.status(400).json({ success: false, message: "Booking already processed" });

    // Prevent TX hash reuse
    const existingTx = await prisma.booking.findFirst({ where: { txHash } });
    if (existingTx)
      return res.status(400).json({ success: false, message: "Transaction already used" });

    // Expected amount in USDC smallest units (6 decimals)
    const expectedAmount: bigint =
      process.env.NODE_ENV === "development"
        ? 1_000_000n // 1 USDC for dev
        : ethers.parseUnits(booking.totalPrice.toString(), 6); // Full hotel price in prod

    // Verify payment
    const payment = await web3Service.verifyUSDCTransfer(
      txHash,
      expectedAmount,
      process.env.TREASURY_ADDRESS!,
      process.env.USDC_ADDRESS!
    );

    if (!payment) throw new Error("Payment verification failed");

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
        txHash,
        walletAddress: payment.sender,
        paymentToken: "USDC",
        paymentStatus: "SUCCESS",
      },
    });

    // Fetch related info
    const [hotelAsset, user] = await Promise.all([
      prisma.hotelAsset.findUnique({ where: { id: booking.hotelAssetId } }),
      prisma.user.findUnique({ where: { id: booking.userId } }),
    ]);

    const hotelName = hotelAsset?.name ?? "Unknown Hotel";
    const hotelLocation = hotelAsset?.location ?? "Unknown Location";
    const hotelDescription = hotelAsset?.description ?? "";

    // Send emails asynchronously
    (async () => {
      try {
        const safeBookingCode = booking.bookingCode ?? "UNKNOWN";
        const safeTotal =
          booking.totalPrice instanceof Prisma.Decimal
            ? booking.totalPrice.toNumber()
            : Number(booking.totalPrice ?? 0);

        if (user?.email) {
          await sendBookingEmail({
            to: user.email,
            bookingCode: safeBookingCode,
            hotelName,
            hotelLocation,
            hotelDescription,
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            total: safeTotal,
            txHash,
          });
          console.log("Booking email sent to user:", user.email);
        }

        if (process.env.ADMIN_EMAIL) {
          await sendBookingEmail({
            to: process.env.ADMIN_EMAIL,
            bookingCode: safeBookingCode,
            hotelName,
            hotelLocation,
            hotelDescription,
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            total: safeTotal,
            txHash,
          });
          console.log("Booking email BCC sent to admin:", process.env.ADMIN_EMAIL);
        }
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }
    })();

    return res.json({
      success: true,
      message: "Booking payment confirmed",
      data: updatedBooking,
    });
  } catch (err: any) {
    console.error("Confirm Booking Payment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
      error: err.message,
    });
  }
};
