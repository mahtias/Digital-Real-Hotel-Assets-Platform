import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";
import { sendBookingEmail } from "../utils/sendBookingEmail";
import { Prisma } from "@prisma/client";
import { ethers } from "ethers";
import { qloService } from "../services/qloService";
import { settlementService } from "../services/settlementService";
import { StablecoinService } from "../services/stablecoinService";
import { yieldService } from "../services/yieldService";

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

    if ( !userId ||!hotelAssetId || !checkInDate ||!checkOutDate || totalPrice === undefined || totalPrice === null) {
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

    // Prevent overlapping booking for the SAME room type
      const conflict = await prisma.booking.findFirst({
        where: {
          hotelAssetId,
          roomType, // ADDED: Checks overlap ONLY if it's the same room category!
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

// ========================================
// CREATE + CONFIRM BOOKING VIA x402
// Called after x402Middleware has already verified & settled the payment
// ========================================
export const createX402Booking = async (req: Request, res: Response) => {
  try {
    const x402Payment = (req as any).x402Payment as { txHash: string | null; amountUSDC: number; paidAt: string } | undefined;
    if (!x402Payment) {
      return res.status(400).json({ success: false, message: "x402 payment info missing" });
    }

    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { hotelAssetId, checkInDate, checkOutDate, totalPrice, roomType, guests, specialRequests } = req.body;

    if (!hotelAssetId || !checkInDate || !checkOutDate || totalPrice === undefined) {
      return res.status(400).json({ success: false, message: "Missing required booking fields" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
    }

    const conflict = await prisma.booking.findFirst({
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

    // Fetch relations needed for PMS sync and email
    const [user, hotelAsset] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.hotelAsset.findUnique({ where: { id: hotelAssetId } }),
    ]);

    if (!user || !hotelAsset) {
      return res.status(404).json({ success: false, message: "User or hotel not found" });
    }

    const paymentAmount = Number(totalPrice);
    const platformFee = Number((paymentAmount * 0.01).toFixed(2));
    const totalYield   = paymentAmount * 0.20;
    const hotelShare   = paymentAmount * 0.79;
    const txHash = x402Payment.txHash || `x402-${Date.now()}`;

    // Create booking and commit — settlement must run after commit because
    // settlementService uses the global prisma client (not the tx proxy)
    const booking = await prisma.booking.create({
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

    // Settlement runs after booking is committed so the connect by ID succeeds
    await settlementService.createSettlement({
      ...booking,
      hotelAsset,
      totalPrice: hotelShare,
    });

    // Yield distribution (fire-and-forget)
    yieldService.distributeFromBooking(booking.id, totalYield, "USDC")
      .catch((err: Error) => console.error(`x402 yield distribution failed for booking ${booking.id}:`, err.message));

    // PMS sync
    let pmsOrderDetails = null;
    try {
      const qloHotelId = hotelAsset.qloHotelId;
      let roomTypeId: number | null = null;
      const roomTypeLower = (roomType || "").toLowerCase().trim();
      if (Number(qloHotelId) === 1) {
        const map: Record<string, number> = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
        roomTypeId = map[roomTypeLower] ?? null;
      } else if (Number(qloHotelId) === 13 || Number(qloHotelId) === 14) {
        const map: Record<string, number> = { standard: 13, deluxe: 14, executive: 15, suite: 16 };
        roomTypeId = map[roomTypeLower] ?? null;
      } else {
        const ROOM_MAP: Record<string, number> = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
        roomTypeId = ROOM_MAP[roomTypeLower] ?? null;
      }

      console.log(`[x402 PMS] qloHotelId=${qloHotelId}, roomType="${roomType}", roomTypeLower="${roomTypeLower}", roomTypeId=${roomTypeId}`);

      if (!roomTypeId || !qloHotelId) {
        console.warn(`[x402 PMS] Skipping sync — missing mapping: qloHotelId=${qloHotelId}, roomTypeId=${roomTypeId}`);
      } else {
        pmsOrderDetails = await qloService.createBookingInPMS({
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

        const qloOrderId =
          typeof pmsOrderDetails === "string" || typeof pmsOrderDetails === "number"
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
          await prisma.booking.update({ where: { id: booking.id }, data: { qloOrderId: String(qloOrderId) } });
          console.log(`[x402 PMS] Synced to QloApp: orderId=${qloOrderId}`);
        } else {
          console.warn("[x402 PMS] QloApp responded but no order ID extracted");
        }
      }
    } catch (pmsErr: any) {
      console.error("[x402 PMS] Sync failed:", pmsErr.message);
    }

    // Confirmation email (fire-and-forget)
    sendBookingEmail({
      to: user.email,
      bookingCode: booking.bookingCode!,
      hotelName: hotelAsset.name,
      hotelLocation: hotelAsset.location ?? "",
      hotelDescription: hotelAsset.description ?? "",
      checkIn,
      checkOut,
      total: paymentAmount,
      txHash,
    }).catch((err: Error) => console.error("x402 email error:", err.message));

    return res.json({
      success: true,
      message: "Booking confirmed via x402",
      data: {
        booking,
        pmsSync: pmsOrderDetails ? "SUCCESS" : "SKIPPED",
        txHash,
      },
    });
  } catch (err: any) {
    console.error("x402 Booking Error:", err);
    return res.status(500).json({ success: false, message: "x402 booking failed", error: err.message });
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

  const page = Math.max(Number(req.query.page) || 1, 1);

const limit = Math.min(
  Math.max(Number(req.query.limit) || 10, 1),
  50
);

const skip = (page - 1) * limit;

const [bookings, total] = await Promise.all([
  prisma.booking.findMany({
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

  prisma.booking.count({
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
    const { bookingId, txHash, paymentToken = "USDC" } = req.body;

    if (!bookingId || !txHash) {
      return res.status(400).json({
        success: false,
        message: "Missing bookingId or txHash",
      });
    }

    // 1️⃣ FETCH BOOKING WITH RELATIONS
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

    // Prevent duplicate transaction usage
    const existingTx = await prisma.booking.findFirst({ where: { txHash } });
    if (existingTx) {
      return res.status(400).json({
        success: false,
        message: "Transaction already used",
      });
    }

    // 2️⃣ VERIFY PAYMENT ON BLOCKCHAIN
    const stablecoin = StablecoinService.getStablecoin(paymentToken);
    StablecoinService.validateToken(paymentToken, "BOOKING");

    const expectedAmount = ethers.parseUnits(
      booking.totalPrice.toString(),
      stablecoin.decimals
    );

    const paymentValid = await web3Service.verifyStablecoinTransfer(
      txHash,
      expectedAmount,
      process.env.TREASURY_ADDRESS!,
      stablecoin
    );

    if (!paymentValid) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 3️⃣ ATOMIC TRANSACTION: UPDATE BOOKING + SETTLEMENT ONLY
    //    Yield distribution runs AFTER commit — blockchain calls can't be inside a DB tx
    const paymentAmount = booking.totalPrice instanceof Prisma.Decimal
      ? booking.totalPrice.toNumber()
      : Number(booking.totalPrice);

    const platformFee   = Number((paymentAmount * 0.01).toFixed(2));
    const totalYield    = paymentAmount * 0.20;
    const hotelShare    = paymentAmount * 0.79;

    const result = await prisma.$transaction(async (tx) => {
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

      // Settlement is pure DB — safe inside the transaction
      await settlementService.createSettlement({
        ...updatedBooking,
        hotelAsset: booking.hotelAsset,
        totalPrice: hotelShare,
      });

      return { updatedBooking };
    });

    // 3a️⃣ DISTRIBUTE YIELD — runs after booking is committed
    //    If blockchain fails, distribution stays PENDING and is retried by background job
    yieldService.distributeFromBooking(result.updatedBooking.id, totalYield, "USDC")
      .catch((err: Error) => {
        console.error(`Yield distribution failed for booking ${result.updatedBooking.id}, will retry:`, err.message);
      });

  // 4️⃣ SYNC TO PMS (QloApps)
let pmsOrderDetails = null;
try {
  const amountNumber =
    booking.totalPrice instanceof Prisma.Decimal
      ? booking.totalPrice.toNumber()
      : Number(booking.totalPrice);

  // ⚡ CUSTOM REPLACEMENT START HERE
  const qloHotelId = booking.hotelAsset?.qloHotelId;

  // ⚡ DYNAMIC MAPPING: Matches room IDs relative to the specific Qlo Hotel ID
  const roomTypeLowerRegular = (booking.roomType || "").toLowerCase().trim();
  let roomTypeId = null;
  if (Number(qloHotelId) === 1) {
    const map: Record<string, number> = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
    roomTypeId = map[roomTypeLowerRegular] ?? null;
  } else if (Number(qloHotelId) === 13 || Number(qloHotelId) === 14) {
    const map: Record<string, number> = { standard: 13, deluxe: 14, executive: 15, suite: 16 };
    roomTypeId = map[roomTypeLowerRegular] ?? null;
  } else {
    // Fallback defaults
    const ROOM_TYPE_MAP: Record<string, number> = { standard: 1, deluxe: 2, executive: 3, suite: 4 };
    roomTypeId = ROOM_TYPE_MAP[roomTypeLowerRegular] ?? null;
  }

  if (!roomTypeId || !qloHotelId) throw new Error(`Missing QloApps mapping for Hotel ${qloHotelId}, Room ${booking.roomType}`);
  //  CUSTOM REPLACEMENT END HERE

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

  console.log("Qlo PMS response:", JSON.stringify(pmsOrderDetails, null, 2));

      const qloOrderId =
      typeof pmsOrderDetails === "string" || typeof pmsOrderDetails === "number"
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

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        qloOrderId: qloOrderId ? String(qloOrderId) : null,
      },
    });

    } catch (err) {
      console.error("❌ PMS Sync Failed:", err);
    }

    // 5️⃣ SEND EMAIL (ASYNC)
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
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const paymentStatus  = req.query.paymentStatus  as string;
    const hotelId = req.query.hotelId as string;

   

    const where: any = {};

    // Status filter
    if (paymentStatus  && paymentStatus  !== "ALL") {
      where.paymentStatus  = paymentStatus ;
    }

    // Hotel filter
    if (hotelId) {
      where.hotelAssetId = hotelId;
    }

    // Search filter
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
      prisma.booking.findMany({
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

      prisma.booking.count({
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

  } catch (err: any) {

    console.error("Admin Bookings Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};