import { Request, Response } from "express";
import prisma from "../config/database";

// Generate unique booking code
function generateBookingCode() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BKG-${new Date().getFullYear()}-${rand}`;
}

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

    // Create booking
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
