import HotelAssetManagerJSON from "./ABI/HotelAssetManager.json";

export const HOTEL_ASSET_MANAGER_ABI = HotelAssetManagerJSON.abi;
// ===================================
// 🏭 HOTEL TOKEN FACTORY ABI
// ===================================
export const FACTORY_ABI = [
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "getTokensByOwner",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenAddress", "type": "address"}],
    "name": "isTokenDeployed",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// =================== ERC_20_ABI ============

export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;
// ===================================
// 🏨 HOTEL TOKEN ABI (Individual Hotels)
// ===================================
export const HOTEL_TOKEN_ABI = [
  // ===== ERC20 Standard =====
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // ===== Hotel Metadata =====
  {
    "inputs": [],
    "name": "hotelId",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hotelName",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "location",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenPriceUSD",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // ===== Investment Functions =====
  {
    "inputs": [{"name": "hatAmount", "type": "uint256"}],
    "name": "investWithHAT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "usdAmount", "type": "uint256"}],
    "name": "investWithUSD",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  // ===== Admin Functions =====
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },

  // ===== Events =====
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "investor", "type": "address"},
      {"indexed": false, "name": "hatAmount", "type": "uint256"},
      {"indexed": false, "name": "tokensReceived", "type": "uint256"}
    ],
    "name": "InvestmentMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
] as const;

// ===================================
// 🆔 KYC REGISTRY ABI
// ===================================
export const KYC_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "isKYCVerified",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserKYCLevel",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "user", "type": "address"},
      {"name": "level", "type": "uint8"}
    ],
    "name": "setKYCStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;




// ===================================
// 🎩 HAT TOKEN ABI (ERC20)
// ===================================
export const HAT_TOKEN_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ===================================
// 📝 TYPE EXPORTS (for TypeScript)
// ===================================
export type FactoryABI = typeof FACTORY_ABI;
export type HotelTokenABI = typeof HOTEL_TOKEN_ABI;
export type KycABI = typeof KYC_ABI;
export type HatABI = typeof HAT_TOKEN_ABI;

