// src/contracts/config.ts
// ===================================
// 🏨 HOTEL ASSET TOKENIZATION CONFIG (Dynamic Hotels)
// ===================================

import { useState } from 'react';

// ================================
// 🌐 NETWORK CONFIG
// ================================
export const NETWORK = {
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID) || 84532, // Base Sepolia
  NAME: 'Base Sepolia',
  RPC_URL: 'https://sepolia.base.org',
  EXPLORER_URL: 'https://sepolia.basescan.org',
  NATIVE_CURRENCY: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

// ================================
// 🏛 CONTRACT ADDRESSES
// ================================
export const CONTRACTS = {
  FACTORY: import.meta.env.VITE_HOTEL_FACTORY_ADDRESS as `0x${string}`,
  KYC: import.meta.env.VITE_KYC_CONTRACT_ADDRESS as `0x${string}`,
  HOTEL_MANAGER: import.meta.env.VITE_HOTEL_ASSET_MANAGER_ADDRESS as `0x${string}`,
  INVESTMENT: import.meta.env.VITE_HOTEL_INVESTMENT_CONTRACT_ADDRESS as `0x${string}`,
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}`,
  USDC: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
} as const;

// ✅ Keep HOTEL_ASSET_MANAGER_ADDRESS export for legacy pages 
export const HOTEL_ASSET_MANAGER_ADDRESS = CONTRACTS.HOTEL_MANAGER;
export const KYC_CONTRACT_ADDRESS = CONTRACTS.KYC;

// ================================
// 📊 TOKEN CONFIG
// ================================
export const TOKEN_CONFIG = {
  HAT_DECIMALS: 18,
  HOTEL_TOKEN_DECIMALS: 18,
  USD_DECIMALS: 6, // for USDC integration
} as const;

// ================================
// 🏨 HOTEL TYPES
// ================================
export type Hotel = {
  id: string;
  name: string;
  tokenAddress: `0x${string}`;
  status: string;
  location?: string;
  image?: string;
};

// ================================
// 🌟 DYNAMIC HOTEL HELPER
// ================================
let hotelCache: Hotel[] | null = null;

/**
 * Fetch hotels dynamically from backend API
 */
export const fetchHotels = async (): Promise<Hotel[]> => {
  if (hotelCache) return hotelCache;

  const res = await fetch('/api/v1/hotels');
  if (!res.ok) throw new Error('Failed to fetch hotels');

  const hotels: Hotel[] = await res.json();
  hotelCache = hotels;
  return hotels;
};

/**
 * Get hotel token map: { hotelId: tokenAddress }
 */
export const getHotelTokenMap = async (): Promise<Record<string, `0x${string}`>> => {
  const hotels = await fetchHotels();
  return Object.fromEntries(hotels.map(h => [h.id, h.tokenAddress])) as Record<string, `0x${string}`>;
};

/**
 * Get hotel token by hotelId
 */
export const getHotelAddress = async (hotelId: string): Promise<`0x${string}` | null> => {
  const map = await getHotelTokenMap();
  return map[hotelId] ?? null;
};

/**
 * Check if a token address is a valid hotel
 */
export const isValidHotelToken = async (address: string): Promise<boolean> => {
  const map = await getHotelTokenMap();
  return Object.values(map).some(addr => addr.toLowerCase() === address.toLowerCase());
};

/**
 * Get hotel metadata (name, image, location) by ID
 */
export const getHotelMetadata = async (hotelId: string): Promise<Partial<Hotel> | null> => {
  const hotels = await fetchHotels();
  return hotels.find(h => h.id === hotelId) ?? null;
};

/**
 * Get block explorer URL
 */
export const getExplorerUrl = (address: string, type: 'address' | 'tx' = 'address'): string => {
  return `${NETWORK.EXPLORER_URL}/${type}/${address}`;
};

// ================================
// 🔧 CONFIG VALIDATION
// ================================
export const validateConfig = (): boolean => {
  const addresses = [
    { name: 'Factory', addr: CONTRACTS.FACTORY },
    { name: 'KYC', addr: CONTRACTS.KYC },
    { name: 'Hotel Manager', addr: CONTRACTS.HOTEL_MANAGER },
  ];

  const invalid = addresses.filter(({ addr }) => !addr || !addr.startsWith('0x') || addr.length < 42);
  if (invalid.length > 0) {
    console.error('❌ Invalid contract addresses:', invalid.map(a => a.name));
    return false;
  }

  console.log('✅ Contract config validated');
  return true;
};

// Auto-validate in browser
if (typeof window !== 'undefined') validateConfig();