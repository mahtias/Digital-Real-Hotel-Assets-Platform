// src/config/stablecoinRegistry.ts

// =====================================================
// 🏦 HKMA STABLECOIN REGISTRY
// =====================================================

export type StablecoinIssuer =
  | "USDC"
  | "USDT"
  | "HSBC"
  | "STANDARD_CHARTERED"
  | "OTHER";

// =====================================================
// 🔐 STABLECOIN TYPE
// =====================================================

export type Stablecoin = {
  symbol: string;
  address: string;
  chainId: number;
  decimals:number;
  // issuer
  issuer: StablecoinIssuer;

  // operational status
  isActive: boolean;

  // environment permissions
  sandboxEnabled: boolean;
  productionEnabled: boolean;

  // compliance capabilities
  supportsFreeze: boolean;
  supportsComplianceHooks: boolean;

  // HKMA classification
  complianceTier: "CRYPTO" | "BANK_GRADE";

  // operation permissions
  allowBookings: boolean;
  allowInvestments: boolean;
  allowSettlements: boolean;
};

// =====================================================
// 🌍 NETWORK CONFIG
// =====================================================

export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  BASE_SEPOLIA: 84532,
  //BASE_MAINNET: 8453,
};

// =====================================================
// 🏦 STABLECOIN REGISTRY
// =====================================================

export const STABLECOIN_REGISTRY: Record<string, Stablecoin> = {
  // =================================================
  // 💵 USDC
  // =================================================

  USDC: {
    symbol: "USDC",

    address: process.env.USDC_ADDRESS!,

    chainId: SUPPORTED_CHAINS.BASE_SEPOLIA,
    decimals:6,
    issuer: "USDC",

    isActive: true,

    sandboxEnabled: true,
    productionEnabled: true,

    supportsFreeze: false,
    supportsComplianceHooks: false,

    complianceTier: "CRYPTO",

    allowBookings: true,
    allowInvestments: true,
    allowSettlements: true,
  },

  // =================================================
  // 💵 USDT
  // =================================================

  USDT: {
    symbol: "USDT",

    address: process.env.USDT_ADDRESS || "",

    chainId: SUPPORTED_CHAINS.BASE_SEPOLIA,
    decimals: 6,
    issuer: "USDT",

    isActive: true,

    sandboxEnabled: true,
    productionEnabled: true,

    supportsFreeze: false,
    supportsComplianceHooks: false,

    complianceTier: "CRYPTO",

    allowBookings: true,
    allowInvestments: false,
    allowSettlements: true,
  },

  // =================================================
  // 🏦 HSBC HKD STABLECOIN
  // =================================================

  HKD_STABLECOIN_HSBC: {
    symbol: "HKD-HSBC",

    address: process.env.HSBC_HKD_ADDRESS || "",

    chainId: SUPPORTED_CHAINS.BASE_SEPOLIA,
    decimals: 6,
    issuer: "HSBC",

    isActive: false,

    sandboxEnabled: true,
    productionEnabled: false,

    supportsFreeze: true,
    supportsComplianceHooks: true,

    complianceTier: "BANK_GRADE",

    allowBookings: true,
    allowInvestments: true,
    allowSettlements: true,
  },

  // =================================================
  // 🏦 STANDARD CHARTERED HKD STABLECOIN
  // =================================================

  HKD_STABLECOIN_SC: {
    symbol: "HKD-SC",

    address: process.env.SC_HKD_ADDRESS ||"",

    chainId: SUPPORTED_CHAINS.BASE_SEPOLIA,
    decimals:6,
    issuer: "STANDARD_CHARTERED",

    isActive: false,

    sandboxEnabled: true,
    productionEnabled: false,

    supportsFreeze: true,
    supportsComplianceHooks: true,

    complianceTier: "BANK_GRADE",

    allowBookings: true,
    allowInvestments: true,
    allowSettlements: true,
  },
};