// src/services/stablecoinService.ts

import {
  STABLECOIN_REGISTRY,
  SUPPORTED_CHAINS,
  Stablecoin,
} from "../config/stablecoinRegistry";

// ======================================================
// 🏦 STABLECOIN SERVICE
// ======================================================

export class StablecoinService {

  // ======================================================
  // 🌐 ACTIVE NETWORK
  // ======================================================

  // ✅ TESTNET (CURRENT)
  static ACTIVE_CHAIN_ID = SUPPORTED_CHAINS.BASE_SEPOLIA;

  //  PRODUCTION (ENABLE LATER)
  // static ACTIVE_CHAIN_ID = SUPPORTED_CHAINS.BASE_MAINNET;

  // ======================================================
  // 1️ GET STABLECOIN
  // ======================================================

  static getStablecoin(token: string): Stablecoin {

    const coin = STABLECOIN_REGISTRY[token];

    //  Not whitelisted
    if (!coin) {
      throw new Error(
        "Stablecoin not in HKMA whitelist registry"
      );
    }

    //  Disabled
    if (!coin.isActive) {
      throw new Error(
        "Stablecoin disabled by compliance policy"
      );
    }

    //  Wrong chain
    if (coin.chainId !== this.ACTIVE_CHAIN_ID) {
      throw new Error(
        `Stablecoin chain mismatch. Expected ${this.ACTIVE_CHAIN_ID}`
      );
    }

    return coin;
  }

  // ======================================================
  // 2️ VALIDATE TOKEN FOR OPERATION
  // ======================================================

  static validateToken(
    token: string,
    operation: "BOOKING" | "INVESTMENT" | "SETTLEMENT"
  ) {

    const coin = this.getStablecoin(token);

    // =========================================
    //  BOOKING CHECK
    // =========================================

    if (
      operation === "BOOKING" &&
      !coin.allowBookings
    ) {
      throw new Error(
        `${coin.symbol} not approved for hotel bookings`
      );
    }

    // =========================================
    // 💰 INVESTMENT CHECK
    // =========================================

    if (
      operation === "INVESTMENT" &&
      !coin.allowInvestments
    ) {
      throw new Error(
        `${coin.symbol} not approved for investments`
      );
    }

    // =========================================
    // 🏦 SETTLEMENT CHECK
    // =========================================

    if (
      operation === "SETTLEMENT" &&
      !coin.allowSettlements
    ) {
      throw new Error(
        `${coin.symbol} not approved for settlements`
      );
    }

    // =========================================
    // 🏦 BANK-GRADE DETECTION
    // =========================================

    if (coin.complianceTier === "BANK_GRADE") {

      console.log(
        "🏦 HKMA Bank-grade stablecoin detected"
      );

      console.log(
        `Issuer: ${coin.issuer}`
      );
    }

    return {
      valid: true,
      coin,
    };
  }

  // ======================================================
  // 3️⃣ CHECK COMPLIANCE MODE
  // ======================================================

  static isComplianceMode(token: string): boolean {

    const coin = this.getStablecoin(token);

    return (
      coin.supportsFreeze ||
      coin.supportsComplianceHooks
    );
  }

  // ======================================================
  // 4️⃣ SANDBOX MODE CHECK
  // ======================================================

  static isSandboxAllowed(token: string): boolean {

    const coin = this.getStablecoin(token);

    return coin.sandboxEnabled;
  }

  // ======================================================
  // 5️⃣ PRODUCTION MODE CHECK
  // ======================================================

  static isProductionAllowed(token: string): boolean {

    const coin = this.getStablecoin(token);

    return coin.productionEnabled;
  }

  // ==============================
// 4. BANK-GRADE COMPLIANCE CHECK
// ==============================
static validateComplianceTransfer(token: string) {

  const coin = this.getStablecoin(token);

  // HKMA / bank-issued stablecoins
  if (coin.supportsComplianceHooks) {

    console.log(
      "🏦 HKMA Compliance Mode Enabled"
    );

    return {
      complianceMode: true,

      requiresEnhancedSettlement: true,

      freezeSupported: coin.supportsFreeze,

      issuer: coin.issuer,
    };
  }

  // Normal stablecoins
  return {
    complianceMode: false,

    requiresEnhancedSettlement: false,

    freezeSupported: false,

    issuer: coin.issuer,
  };
}
}