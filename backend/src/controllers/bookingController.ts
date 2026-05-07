import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";
import { sendBookingEmail } from "../utils/sendBookingEmail";
import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { qloService } from "../services/qloService";
import { settlementService } from "../services/settlementService";

// ========================================
// 🔗 QLOAPPS MAPPING (REQUIRED)
// ========================================

const ROOM_TYPE_MAP: Record<string, number> = {
  standard: 1,   // General Rooms
  deluxe: 2,     // Delux Rooms
  executive: 3,  // Executive Rooms (optional)
  suite: 4,      // Luxury Rooms
};

const HOTEL_MAP: Record<string, number> = {
  "4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722": 1, // My Hotel Name
  "25c38d85-6b08-48f3-8d67-3795a32a9fbf": 1, // Marina Bay Sands
  "09c1fdb9-c592-4240-bcec-1c7a729074a7": 1, // Ritz Carlton Bali
  "e009ef84-23bc-473e-b5d8-6c9a7498c784": 1, // Grand Plaza Hotel
  "d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce": 1, // Waldorf Astoria
  "12a04eed-c00f-4374-9261-2842ffcee58d": 1, // Mountain View Lodge
};

// ========================================
// 🔑 HELPERS
// ========================================

function generateBookingCode() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  const year = new Date().getFullYear();
  return `DRA-BKG-${year}-${rand}`;
}

// ========================================
// CREATE BOOKING
// ========================================

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
      roomType,
    } = req.body;

    if (!userId || !hotelAssetId || !checkInDate || !checkOutDate || !totalPrice) {
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

    // Prevent overlapping booking
    const conflict = await prisma.booking.findFirst({
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

    const booking = await prisma.booking.create({
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
  } catch (err: any) {
    console.error("Create Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message,
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
// GET BOOKINGS FOR LOGGED-IN USER (with hotel details)
// ------------------------------------
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const bookings = await prisma.booking.findMany({
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
    
  } catch (err: any) {
    console.error("Get User Bookings Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
      error: err.message,
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

// ========================================
// CONFIRM BOOKING PAYMENT
// ========================================

export const confirmBookingPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, txHash } = req.body;

    if (!bookingId || !txHash) {
      return res.status(400).json({
        success: false,
        message: "Missing bookingId or txHash",
      });
    }

    // 🔍 Get booking
    const booking = await prisma.booking.findUnique({
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

    // Prevent TX reuse
    const existingTx = await prisma.booking.findFirst({ where: { txHash } });
    if (existingTx) {
      return res.status(400).json({
        success: false,
        message: "Transaction already used",
      });
    }

    //  Verify payment
    const expectedAmount = ethers.parseUnits(booking.totalPrice.toString(), 6);

    const payment = await web3Service.verifyUSDCTransfer(
      txHash,
      expectedAmount,
      process.env.TREASURY_ADDRESS!,
      process.env.USDC_ADDRESS!
    );

    if (!payment) throw new Error("Payment verification failed");

    // ========================================
    // 🔥 ATOMIC TRANSACTION (BOOKING + YIELD)
    // ========================================

    const result = await prisma.$transaction(async (tx) => {
      // ✅ Convert amount
      const paymentAmount =
        booking.totalPrice instanceof Prisma.Decimal
          ? booking.totalPrice.toNumber()
          : Number(booking.totalPrice);

      // ✅ 10% yield pool
      const totalYield = paymentAmount * 0.10;

      // ✅ Update booking
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          txHash,
          walletAddress: payment.sender,
          paymentToken: "USDC",
          paymentStatus: "SUCCESS",
        },
      });

      // ✅ Fetch investors INSIDE transaction
      const investments = await tx.investment.findMany({
        where: {
          hotelAssetId: booking.hotelAssetId,
          status: "ACTIVE",
        },
      });

      if (investments.length > 0) {
        const totalInvested = investments.reduce((sum, inv) => {
          return sum + Number(inv.investedAmount);
        }, 0);

        for (const inv of investments) {
          if (totalInvested === 0) continue;

          const invested = Number(inv.investedAmount);
          const userShare = invested / totalInvested;
          const userYield = Number((totalYield * userShare).toFixed(6));

          await tx.investment.update({
            where: { id: inv.id },
            data: {
              pendingRewards: {
                increment: userYield,
              },
            },
          });
        }
      }

      // OPTIONAL audit field
      // await tx.booking.update({
      //   where: { id: booking.id },
      //   data: { yieldGenerated: totalYield },
      // });

      return { updatedBooking };
    });

    // ========================================
    // 🔗 STEP 2: SYNC TO QLOAPPS (OUTSIDE TX)
    // ========================================

    let pmsOrderDetails = null;

    try {
      const amountNumber =
        booking.totalPrice instanceof Prisma.Decimal
          ? booking.totalPrice.toNumber()
          : Number(booking.totalPrice);

      const roomTypeId = ROOM_TYPE_MAP[booking.roomType];
      const qloHotelId = HOTEL_MAP[booking.hotelAssetId];

      if (!roomTypeId || !qloHotelId) {
        throw new Error("Missing QloApps mapping");
      }

      pmsOrderDetails = await qloService.createBookingInPMS({
        email: booking.user.email,
        firstName: booking.user.firstName || "Web3",
        lastName: booking.user.lastName || "Investor",
        amount: amountNumber,
        hotelId: qloHotelId,
        roomTypeId,
        dateFrom: booking.checkInDate.toISOString().split("T")[0],
        dateTo: booking.checkOutDate.toISOString().split("T")[0],
      });

      console.log("✅ PMS Sync Success");
      await prisma.booking.update({
      where: { id: bookingId },
      data: {
        qloOrderId: pmsOrderDetails?.id || pmsOrderDetails,
      },
    });
      // 🏨 CREATE SETTLEMENT
      await settlementService.createSettlement(booking);
    } catch (err) {
      console.error("❌ PMS Sync Failed:", err);
    }

    // ========================================
    // 📧 STEP 3: EMAIL (ASYNC)
    // ========================================

    (async () => {
      try {
        await sendBookingEmail({
          to: booking.user.email,
          bookingCode: booking.bookingCode!,
          hotelName: booking.hotelAsset?.name ?? "Hotel",
          hotelLocation: booking.hotelAsset?.location ?? "",
          hotelDescription: booking.hotelAsset?.description ?? "",
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
          total: Number(booking.totalPrice),
          txHash,
        });
      } catch (err) {
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

  } catch (err: any) {
    console.error("Confirm Payment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
      error: err.message,
    });
  }
};

// ========================================
// 🧾 ADMIN: GET ALL BOOKINGS (WITH DETAILS)
// ========================================
// ========================================
// 🧾 ADMIN: GET ALL BOOKINGS
// ========================================

export const getAllBookingsAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const bookings = await prisma.booking.findMany({

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

  } catch (err: any) {

    console.error("Admin Bookings Error:", err);

    return res.status(500).json({
      error: err.message,
    });

  }
};