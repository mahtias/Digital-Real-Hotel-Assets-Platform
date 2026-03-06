// ===================================
// 🏨 HOTEL ASSET TOKENIZATION - CONTRACT CONFIG
// ===================================

// Factory Contract (deploys hotel tokens)
export const FACTORY_ADDRESS = "0xDEd9Ac229F5c653BD85302f68bB44D20E775Cf3e" as const;
export const HOTEL_ASSET_MANAGER_ADDRESS ="0x572C8046A079F5782405212c17C44cA74eF9c4Ed" as const;

// HAT Token (Base Sepolia)
//export const HAT_TOKEN_ADDRESS = "0xd1d60d87688b9a08549e90751a647b3bd6babb57" as const;

// KYC Registry
export const KYC_CONTRACT_ADDRESS = "0x4CC1266e950a15f5F80e2554fc91E013644085Cf" as const;

// ===================================
// 🏨 DEPLOYED HOTEL TOKENS Addess
// ===================================
export const HOTEL_TOKENS = {
  HOTEL001: "0x1aD854F22927bB91c54e8FbC5F59b286eE3965a3", // Grand Plaza Hotel
  HOTEL004: "0xFd9F285B5b4759d7c38BF71CBe10A07aCA09610B", // Grand Plaza Hotel #2
  HOTEL005: "0x3AA7703D6464199279F0DA98AC54C7CA7EA4BfB0", // Beach Resort Paradise
  HOTEL006: "0xa01763D10df5D90f64309aCE98Be62f9908A5086", // Mountain View Lodge
} as const;

// ===================================
// 🌐 NETWORK CONFIG
// ===================================
export const NETWORK = {
  CHAIN_ID: 84532, // Base Sepolia
  NAME: "Base Sepolia",
  RPC_URL: "https://sepolia.base.org",
  EXPLORER_URL: "https://sepolia.basescan.org",
  NATIVE_CURRENCY: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
} as const;

// ===================================
// 📝 LEGACY CONTRACTS (for reference)
// ===================================
export const LEGACY_CONTRACTS = {
  // These are old contracts - NOT USED in new architecture
  HOTEL_MANAGER: import.meta.env.VITE_HOTEL_ASSET_MANAGER_ADDRESS as `0x${string}` | undefined,
  INVESTMENT: import.meta.env.VITE_INVESTMENT_CONTRACT_ADDRESS as `0x${string}` | undefined,
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}` | undefined,
  MOCK_USDC: import.meta.env.VITE_MOCK_USDC_ADDRESS as `0x${string}` | undefined,
} as const;

// ===================================
// 🎯 MAIN CONTRACTS (Use These!)
// ===================================
export const CONTRACTS = {
  FACTORY: FACTORY_ADDRESS,
  //HAT_TOKEN: HAT_TOKEN_ADDRESS,
  KYC: KYC_CONTRACT_ADDRESS,
  HOTELS: HOTEL_TOKENS,
} as const;

// ===================================
// 🔧 HELPER FUNCTIONS
// ===================================

/**
 * Get hotel token address by ID
 */
export const getHotelAddress = (hotelId: string): `0x${string}` | null => {
  const address = HOTEL_TOKENS[hotelId as keyof typeof HOTEL_TOKENS];
  return address ? (address as `0x${string}`) : null;
};

/**
 * Get all hotel addresses as array
 */
export const getAllHotelAddresses = (): `0x${string}`[] => {
  return Object.values(HOTEL_TOKENS) as `0x${string}`[];
};

/**
 * Get hotel ID from address
 */
export const getHotelIdFromAddress = (address: string): string | null => {
  const entry = Object.entries(HOTEL_TOKENS).find(
    ([_, addr]) => addr.toLowerCase() === address.toLowerCase()
  );
  return entry ? entry[0] : null;
};

/**
 * Check if address is a valid hotel token
 */
export const isValidHotelToken = (address: string): boolean => {
  return getAllHotelAddresses().some(
    (addr) => addr.toLowerCase() === address.toLowerCase()
  );
};

/**
 * Get block explorer URL for address
 */
export const getExplorerUrl = (address: string, type: 'address' | 'tx' = 'address'): string => {
  return `${NETWORK.EXPLORER_URL}/${type}/${address}`;
};

// ===================================
// 📊 TOKEN CONSTANTS
// ===================================
export const TOKEN_CONFIG = {
  HAT_DECIMALS: 18,
  HOTEL_TOKEN_DECIMALS: 18,
  USD_DECIMALS: 6, // For future USDC integration
} as const;

// ===================================
// 🎨 HOTEL METADATA (for UI)
// ===================================
export const HOTEL_METADATA = {
  HOTEL001: {
    name: "Grand Plaza Hotel",
    shortName: "Grand Plaza",
    location: "Dubai, UAE",
    image: "/images/hotels/grand-plaza.jpg",
  },
  HOTEL004: {
    name: "Grand Plaza Hotel #2",
    shortName: "Grand Plaza 2",
    location: "Dubai, UAE",
    image: "/images/hotels/grand-plaza-2.jpg",
  },
  HOTEL005: {
    name: "Beach Resort Paradise",
    shortName: "Beach Resort",
    location: "Maldives",
    image: "/images/hotels/beach-resort.jpg",
  },
  HOTEL006: {
    name: "Mountain View Lodge",
    shortName: "Mountain Lodge",
    location: "Swiss Alps",
    image: "/images/hotels/mountain-lodge.jpg",
  },
} as const;

// ===================================
//  ENVIRONMENT VALIDATION
// ===================================
export const validateConfig = (): boolean => {
  const addresses = [
    { name: 'Factory', addr: FACTORY_ADDRESS },
   // { name: 'HAT Token', addr: HAT_TOKEN_ADDRESS },
    { name: 'KYC', addr: KYC_CONTRACT_ADDRESS },
  ];

  const invalid = addresses.filter(
    ({ addr }) => !addr || addr.length < 42 || !addr.startsWith('0x')
  );

  if (invalid.length > 0) {
    console.error('❌ Invalid contract addresses:', invalid.map(a => a.name));
    return false;
  }

  console.log('Contract config validated');
  console.log(' Factory:', FACTORY_ADDRESS);
  //console.log(' HAT Token:', HAT_TOKEN_ADDRESS);
  console.log(' KYC:', KYC_CONTRACT_ADDRESS);
  console.log(' Hotels:', Object.keys(HOTEL_TOKENS).length);
  
  return true;
};

// ===================================
// AUTO-VALIDATE ON IMPORT
// ===================================
if (typeof window !== 'undefined') {
  // Only run in browser (not during SSR)
  validateConfig();
}

// ===================================
//  TYPE EXPORTS
// ===================================
export type HotelId = keyof typeof HOTEL_TOKENS;
export type ContractAddress = `0x${string}`;
export type NetworkConfig = typeof NETWORK;
