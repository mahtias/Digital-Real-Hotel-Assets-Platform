// backend/src/services/settlementService.ts

import prisma from "../config/database";
import { Prisma } from "@prisma/client";
import { ethers } from "ethers";

import { StablecoinService } from "./stablecoinService";

import { Stablecoin } from "../config/stablecoinRegistry";

// ============================================================
// 🌐 WEB3 SETUP
// ============================================================

const provider = new ethers.JsonRpcProvider(
  process.env.BASE_SEPOLIA_RPC
);

const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY!,
  provider
);

// ============================================================
// 🪙 ERC20 ABI
// ============================================================

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

// ============================================================
// ⚙️ CONFIG
// ============================================================

const SETTLEMENT_CONFIG = {
  MAX_RETRIES: 3,
  MIN_CONFIRMATIONS: 1,
} as const;

// ============================================================
// 🏦 SETTLEMENT SERVICE
// ============================================================

export const settlementService = {
  // ==========================================================
  // 🪙 GET TOKEN CONTRACT
  // ==========================================================

  getTokenContract(stablecoin: Stablecoin) {
    return new ethers.Contract(
      stablecoin.address,
      ERC20_ABI,
      signer
    );
  },

  // ==========================================================
  // 🏨 STEP 1: CREATE SETTLEMENT
  // ==========================================================

  async createSettlement(
    booking: any,
    currency: string = "USDC"
  ) {
    try {
      // ======================================================
      //  VALIDATE STABLECOIN
      // ======================================================

      StablecoinService.validateToken(currency, "BOOKING");

      const stablecoin =
        StablecoinService.getStablecoin(currency);

      // ======================================================
      //  HOTEL WALLET CHECK
      // ======================================================

     let hotelWallet = booking.hotelAsset?.walletAddress;

      if (!hotelWallet) {
        const hotelAsset = await prisma.hotelAsset.findUnique({
          where: {
            id: booking.hotelAssetId,
          },
          select: {
            walletAddress: true,
          },
        });

        hotelWallet = hotelAsset?.walletAddress;
      }

      if (!hotelWallet) {
        throw new Error("Hotel wallet not found");
      }

      hotelWallet = hotelWallet.trim();

      // ======================================================
      //  SAFE AMOUNT CONVERSION
      // ======================================================

      const amount =
        booking.totalPrice instanceof Prisma.Decimal
          ? booking.totalPrice.toNumber()
          : Number(booking.totalPrice);

      if (amount <= 0) {
        throw new Error("Invalid settlement amount");
      }

      // ======================================================
      //  IDEMPOTENCY CHECK
      // Prevent duplicate settlement creation
      // ======================================================

      const existingSettlement =
        await prisma.settlement.findFirst({
          where: {
            bookingId: booking.id,
          },
        });

      if (existingSettlement) {
        console.log(
          " Settlement already exists:",
          existingSettlement.id
        );

        return existingSettlement;
      }

      // ======================================================
      //  CREATE SETTLEMENT
      // ======================================================

      const settlement = await prisma.settlement.create({
        data: {
          hotelWallet,
          amount: new Prisma.Decimal(amount),

          currency: stablecoin.symbol,

          status: "PENDING",
           stablecoinSymbol: stablecoin.symbol,
            stablecoinAddress: stablecoin.address,
            chainId: stablecoin.chainId,
          retryCount: 0,

          booking: {
            connect: {
              id: booking.id,
            },
          },

          hotelAsset: {
            connect: {
              id: booking.hotelAssetId,
            },
          },
        },
      });

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" SETTLEMENT CREATED");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Booking:", booking.id);
      console.log("Hotel:", booking.hotelAssetId);
      console.log("Currency:", stablecoin.symbol);
      console.log("Amount:", amount);
      console.log("Wallet:", hotelWallet);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      return settlement;
    } catch (err: any) {
      console.error(
        " Settlement creation error:",
        err.message
      );

      throw err;
    }
  },

  // ==========================================================
  // 💸 STEP 2: PROCESS HOTEL PAYOUT
  // ==========================================================

  async processHotelPayout(
    hotelAssetId: string,
    currency: string = "USDC"
  ) {
    try {
      // ======================================================
      //  VALIDATE STABLECOIN
      // ======================================================

      StablecoinService.validateToken(
        currency,
        "BOOKING"
      );

      const stablecoin =
        StablecoinService.getStablecoin(currency);

      const tokenContract =
        this.getTokenContract(stablecoin);

      // ======================================================
      //  GET PENDING SETTLEMENTS
      // ======================================================

      const settlements =
        await prisma.settlement.findMany({
          where: {
            hotelAssetId,

            currency: stablecoin.symbol,

            status: "PENDING",
          },

          orderBy: {
            createdAt: "asc",
          },
        });

      if (settlements.length === 0) {
        console.log(
          `No pending ${stablecoin.symbol} settlements`
        );

        return {
          success: true,
          message: "No pending settlements",
        };
      }

      // ======================================================
      // ✅ CALCULATE TOTAL PAYOUT + RESERVE FUND
      // ======================================================

      const totalAmount = settlements.reduce(
        (sum, settlement) => {
          return sum + Number(settlement.amount);
        },
        0
      );

      if (totalAmount <= 0) {
        throw new Error("Invalid payout amount");
      }

      const RESERVE_PCT = Number(process.env.RESERVE_FUND_PERCENT ?? 5) / 100;
      const reserveAmount = Number((totalAmount * RESERVE_PCT).toFixed(stablecoin.decimals));
      const payoutAmount  = Number((totalAmount - reserveAmount).toFixed(stablecoin.decimals));

      const hotelWallet = settlements[0].hotelWallet;

      // ======================================================
      // ✅ WALLET VALIDATION
      // ======================================================

      if (!ethers.isAddress(hotelWallet)) {
        throw new Error("Invalid hotel wallet address");
      }

      // ======================================================
      // ✅ CONVERT TO TOKEN UNITS (payout only — reserve held)
      // ======================================================

      const amountWei = ethers.parseUnits(
        payoutAmount.toFixed(stablecoin.decimals),
        stablecoin.decimals
      );

      // ======================================================
      // ✅ TREASURY BALANCE CHECK
      // ======================================================

      const treasuryBalance =
        await tokenContract.balanceOf(signer.address);

      if (treasuryBalance < amountWei) {
        throw new Error(
          `Insufficient ${stablecoin.symbol} treasury balance`
        );
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" PROCESSING HOTEL PAYOUT");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Hotel:", hotelAssetId);
      console.log("Currency:", stablecoin.symbol);
      console.log("Settlements:", settlements.length);
      console.log("Total:", totalAmount);
      console.log("Reserve (5%):", reserveAmount);
      console.log("Payout:", payoutAmount);
      console.log("Wallet:", hotelWallet);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // ======================================================
      // 🔒 MARK AS PROCESSING
      // Prevent double payout
      // ======================================================

      await prisma.settlement.updateMany({
        where: {
          id: {
            in: settlements.map((s) => s.id),
          },
        },

        data: {
          status: "PROCESSING",
        },
      });

      // ======================================================
      // 🔄 EXECUTE BLOCKCHAIN TRANSFER
      // ======================================================

      console.log(
        ` Sending ${stablecoin.symbol} transfer...`
      );

      const tx = await tokenContract.transfer(
        hotelWallet,
        amountWei
      );

      console.log("📤 Transaction sent:", tx.hash);

      // ======================================================
      // ⛓️ WAIT FOR CONFIRMATION
      // ======================================================

      const receipt = await tx.wait(
        SETTLEMENT_CONFIG.MIN_CONFIRMATIONS
      );

      if (!receipt) {
        throw new Error("Transaction receipt missing");
      }

      if (receipt.status !== 1) {
        throw new Error("Blockchain transaction failed");
      }

      const txHash = receipt.hash;

      console.log(" Blockchain payout confirmed");
      console.log("TX:", txHash);

      // ======================================================
      // ✅ FINALIZE DB
      // ======================================================

      await prisma.settlement.updateMany({
        where: {
          id: {
            in: settlements.map((s) => s.id),
          },
        },

        data: {
          status: "COMPLETED",
          txHash,
          processedAt: new Date(),
          failureReason: null,
        },
      });

      // Record reserve fund in Treasury (non-blocking)
      if (reserveAmount > 0) {
        prisma.treasury.create({
          data: {
            hotelAssetId,
            amount: reserveAmount,
            type: "RESERVE",
            status: "HELD",
          },
        }).catch((err: any) => console.error("Treasury reserve record failed:", err.message));
      }

      // ======================================================
      // ✅ RETURN SUCCESS
      // ======================================================

      return {
        success: true,

        hotelAssetId,

        currency: stablecoin.symbol,

        totalAmount,
        reserveAmount,
        payoutAmount,

        txHash,

        settlementCount: settlements.length,

        hotelWallet,
      };
    } catch (err: any) {
      console.error(
        " Payout processing error:",
        err.message
      );

      // ======================================================
      //  UPDATE FAILED SETTLEMENTS
      // ======================================================

      try {
        await prisma.settlement.updateMany({
          where: {
            hotelAssetId,

            currency,

            status: "PROCESSING",
          },

          data: {
            status: "FAILED",

            retryCount: {
              increment: 1,
            },

            failureReason:
              err.message || "Unknown payout failure",
          },
        });
      } catch (dbErr) {
        console.error(
          " Failed updating settlement failure state:",
          dbErr
        );
      }

      throw err;
    }
  },

  // ==========================================================
  // 🔁 RETRY FAILED PAYOUTS
  // ==========================================================

  async retryFailedPayouts() {
    try {
      const failedSettlements =
        await prisma.settlement.findMany({
          where: {
            status: "FAILED",

            retryCount: {
              lt: SETTLEMENT_CONFIG.MAX_RETRIES,
            },
          },

          select: {
            hotelAssetId: true,
            currency: true,
          },

          distinct: ["hotelAssetId", "currency"],
        });

      console.log(
        ` Retrying ${failedSettlements.length} payout groups`
      );

      for (const item of failedSettlements) {
        try {
          await this.processHotelPayout(
            item.hotelAssetId,
            item.currency
          );
        } catch (err: any) {
          console.error(
            `Retry failed for ${item.hotelAssetId}:`,
            err.message
          );
        }
      }

      return {
        success: true,
        retried: failedSettlements.length,
      };
    } catch (err: any) {
      console.error(
        " Retry payouts failed:",
        err.message
      );

      throw err;
    }
  },

  // ==========================================================
  // 📊 GET TREASURY BALANCE
  // ==========================================================

  async getTreasuryBalance(
    currency: string = "USDC"
  ) {
    StablecoinService.validateToken(
      currency,
      "BOOKING"
    );

    const stablecoin =
      StablecoinService.getStablecoin(currency);

    const tokenContract =
      this.getTokenContract(stablecoin);

    const balance =
      await tokenContract.balanceOf(signer.address);

    return {
      currency: stablecoin.symbol,

      wallet: signer.address,

      balance: ethers.formatUnits(
        balance,
        stablecoin.decimals
      ),
    };
  },

  // --------------------------------------------------
// 🔁 BATCH: PROCESS ALL PENDING HOTEL PAYOUTS
// --------------------------------------------------
async processAllPendingPayouts() {
  console.log(" Processing all pending hotel payouts...");

  // Fetch hotel assets that have pending settlements
  const hotelAssetsWithPending = await prisma.settlement.findMany({
    where: { status: "PENDING" },
    select: { hotelAssetId: true, currency: true },
    distinct: ["hotelAssetId", "currency"],
  });

  for (const item of hotelAssetsWithPending) {
    try {
      await this.processHotelPayout(item.hotelAssetId, item.currency);
      console.log(` Payout processed for hotel ${item.hotelAssetId}`);
    } catch (err) {
      console.error(` Payout failed for hotel ${item.hotelAssetId}:`, err);
    }
  }

  console.log("🔄 All pending hotel payouts processed.");
}
};