// src/config/stablecoinRegistry.ts

export const STABLECOIN_REGISTRY = {
  USDC: {
    symbol: "USDC",
    address: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
    decimals: 6,
  },

  USDT: {
    symbol: "USDT",
    address: import.meta.env.VITE_USDT_ADDRESS as `0x${string}`,
    decimals: 6,
  },

//   XSGD: {
//     symbol: "XSGD",
//     address: import.meta.env.VITE_XSGD_ADDRESS as `0x${string}`,
//     decimals: 6,
//   },
  HKD_STABLECOIN_SC: {
    symbol: "HKD-SC",
    address: import.meta.env.VITE_SC_HKD_ADDRESS as `0x${string}`,
    decimals: 6,
  },
  HKD_STABLECOIN_HSBC: {
    symbol: "HKD-HSBC",
    address: import.meta.env.VITE_HSBC_HKD_ADDRESS as `0x${string}`,
    decimals: 6,
  },
}; 