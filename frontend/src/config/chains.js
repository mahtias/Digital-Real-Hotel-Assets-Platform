// ===================================
// SMART CONTRACT ADDRESSES
// ===================================

// Factory Contract (deploys hotel tokens)
export const FACTORY_ADDRESS = "0xDEd9Ac229F5c653BD85302f68bB44D20E775Cf3e";

// HAT Token (Base Sepolia)
export const HAT_TOKEN_ADDRESS = "0x16976c631c64372c20618cd84a41363bbb79ba17";

// KYC Registry
export const KYC_CONTRACT_ADDRESS = "0x4CC1266e950a15f5F80e2554fc91E013644085Cf";

// Hotel Tokens (from your deployment)
export const HOTEL_TOKENS = {
  HOTEL001: "0x1aD854F22927bB91c54e8FbC5F59b286eE3965a3", // Grand Plaza Hotel
  HOTEL004: "0xFd9F285B5b4759d7c38BF71CBe10A07aCA09610B", // Grand Plaza Hotel #2
  HOTEL005: "0x3AA7703D6464199279F0DA98AC54C7CA7EA4BfB0", // Beach Resort Paradise
  HOTEL006: "0xa01763D10df5D90f64309aCE98Be62f9908A5086", // Mountain View Lodge
};

// ===================================
// NETWORK CONFIG
// ===================================

export const BASE_SEPOLIA = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
};


// ===================================
// HELPER FUNCTIONS
// ===================================

export const getHotelTokenAddress = (hotelId) => {
  return HOTEL_TOKENS[hotelId] || null;
};

export const getAllHotelAddresses = () => {
  return Object.values(HOTEL_TOKENS);
};

export const getExplorerUrl = (address) => {
  return `${BASE_SEPOLIA.blockExplorers.default.url}/address/${address}`;
};
