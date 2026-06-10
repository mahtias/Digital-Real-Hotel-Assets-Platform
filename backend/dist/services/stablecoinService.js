"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StablecoinService = void 0;
const stablecoinRegistry_1 = require("../config/stablecoinRegistry");
class StablecoinService {
    static { this.ACTIVE_CHAIN_ID = stablecoinRegistry_1.SUPPORTED_CHAINS.BASE_SEPOLIA; }
    static getStablecoin(token) {
        const coin = stablecoinRegistry_1.STABLECOIN_REGISTRY[token];
        if (!coin) {
            throw new Error("Stablecoin not in HKMA whitelist registry");
        }
        if (!coin.isActive) {
            throw new Error("Stablecoin disabled by compliance policy");
        }
        if (coin.chainId !== this.ACTIVE_CHAIN_ID) {
            throw new Error(`Stablecoin chain mismatch. Expected ${this.ACTIVE_CHAIN_ID}`);
        }
        return coin;
    }
    static validateToken(token, operation) {
        const coin = this.getStablecoin(token);
        if (operation === "BOOKING" &&
            !coin.allowBookings) {
            throw new Error(`${coin.symbol} not approved for hotel bookings`);
        }
        if (operation === "INVESTMENT" &&
            !coin.allowInvestments) {
            throw new Error(`${coin.symbol} not approved for investments`);
        }
        if (operation === "SETTLEMENT" &&
            !coin.allowSettlements) {
            throw new Error(`${coin.symbol} not approved for settlements`);
        }
        if (coin.complianceTier === "BANK_GRADE") {
            console.log("🏦 HKMA Bank-grade stablecoin detected");
            console.log(`Issuer: ${coin.issuer}`);
        }
        return {
            valid: true,
            coin,
        };
    }
    static isComplianceMode(token) {
        const coin = this.getStablecoin(token);
        return (coin.supportsFreeze ||
            coin.supportsComplianceHooks);
    }
    static isSandboxAllowed(token) {
        const coin = this.getStablecoin(token);
        return coin.sandboxEnabled;
    }
    static isProductionAllowed(token) {
        const coin = this.getStablecoin(token);
        return coin.productionEnabled;
    }
    static validateComplianceTransfer(token) {
        const coin = this.getStablecoin(token);
        if (coin.supportsComplianceHooks) {
            console.log("🏦 HKMA Compliance Mode Enabled");
            return {
                complianceMode: true,
                requiresEnhancedSettlement: true,
                freezeSupported: coin.supportsFreeze,
                issuer: coin.issuer,
            };
        }
        return {
            complianceMode: false,
            requiresEnhancedSettlement: false,
            freezeSupported: false,
            issuer: coin.issuer,
        };
    }
}
exports.StablecoinService = StablecoinService;
//# sourceMappingURL=stablecoinService.js.map