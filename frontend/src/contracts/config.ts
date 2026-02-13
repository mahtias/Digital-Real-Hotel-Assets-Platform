// frontend/src/contracts/config.ts
export const CONTRACTS = {
  KYC: import.meta.env.VITE_KYC_CONTRACT_ADDRESS as `0x${string}`,
  HAT_TOKEN: import.meta.env.VITE_HAT_CONTRACT_ADDRESS as `0x${string}`,
  HOTEL_MANAGER: import.meta.env.VITE_HOTEL_ASSET_MANAGER_ADDRESS as `0x${string}`,
  INVESTMENT: import.meta.env.VITE_INVESTMENT_CONTRACT_ADDRESS as `0x${string}`,
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}`,
  MOCK_USDC: import.meta.env.VITE_MOCK_USDC_ADDRESS as `0x${string}`,
  USDC: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
} as const;

export const NETWORK = {
  CHAIN_ID: 84532, // Base Sepolia
  RPC_URL: "https://base-sepolia.g.alchemy.com/v2/w4sdyVuAlr44h9jRAE08y",
};
