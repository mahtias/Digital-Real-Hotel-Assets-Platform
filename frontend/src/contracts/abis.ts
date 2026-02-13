// frontend/src/contracts/abis.ts
export const HOTEL_ABI = [
  {
    "inputs": [
      {"name": "hotelId", "type": "uint256"},
      {"name": "hatAmount", "type": "uint256"}
    ],
    "name": "invest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const KYC_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "isVerified",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const HAT_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
