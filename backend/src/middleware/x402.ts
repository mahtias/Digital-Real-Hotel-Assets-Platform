import { Request, Response, NextFunction } from "express";

// x402 uses ESM-style exports — import via require paths
const { verify: facilitatorVerify } = require("x402/facilitator");
const { useFacilitator } = require("x402/verify");

const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator";
const TREASURY_ADDRESS = (process.env.TREASURY_ADDRESS || "") as `0x${string}`;
const NETWORK = "base-sepolia";

/**
 * x402 payment middleware for booking routes.
 *
 * Flow:
 *  1. Request arrives without X-PAYMENT header  → respond 402 with payment details
 *  2. Client pays on-chain and retries with X-PAYMENT header
 *  3. Middleware verifies the payment via Coinbase facilitator
 *  4. Attaches `req.x402Payment` with verified amount + txHash, calls next()
 *
 * Only activates when query param `?pay=x402` is present.
 * Normal USDC flow (no query param) bypasses this middleware.
 */
export const x402Middleware = (priceUSDC: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only intercept when client explicitly requests x402 payment
    if (req.query.pay !== "x402") {
      return next();
    }

    const paymentHeader = req.headers["x-payment"] as string | undefined;

    if (!paymentHeader) {
      // No payment yet — return 402 with payment requirements
      return res.status(402).json({
        x402Version: 1,
        error: "Payment Required",
        accepts: [
          {
            scheme: "exact",
            network: NETWORK,
            maxAmountRequired: String(Math.round(priceUSDC * 1_000_000)), // USDC has 6 decimals
            resource: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
            description: `Hotel booking payment: $${priceUSDC} USDC`,
            mimeType: "application/json",
            payTo: TREASURY_ADDRESS,
            maxTimeoutSeconds: 300,
            asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
            extra: {
              name: "DIGIREAL Assets Booking",
              version: "1",
            },
          },
        ],
      });
    }

    // Payment header present — verify via facilitator
    try {
      const verifyFn = useFacilitator({ url: FACILITATOR_URL });

      const paymentPayload = JSON.parse(
        Buffer.from(paymentHeader, "base64").toString("utf8")
      );

      const result = await verifyFn(paymentPayload, {
        scheme: "exact",
        network: NETWORK,
        maxAmountRequired: String(Math.round(priceUSDC * 1_000_000)),
        resource: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        description: `Hotel booking payment: $${priceUSDC} USDC`,
        mimeType: "application/json",
        payTo: TREASURY_ADDRESS,
        maxTimeoutSeconds: 300,
        asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        extra: { name: "DIGIREAL Assets Booking", version: "1" },
      });

      if (!result.isValid) {
        return res.status(402).json({
          x402Version: 1,
          error: result.invalidReason || "Invalid payment",
        });
      }

      // Attach verified payment info for the booking controller
      (req as any).x402Payment = {
        txHash: paymentPayload.transaction?.hash || paymentPayload.txHash || null,
        amountUSDC: priceUSDC,
        paidAt: new Date().toISOString(),
      };

      next();
    } catch (err: any) {
      console.error("x402 verification error:", err.message);
      return res.status(402).json({
        x402Version: 1,
        error: "Payment verification failed. Please retry.",
      });
    }
  };
};
