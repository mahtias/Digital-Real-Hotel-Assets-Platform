import {
  createPublicClient,
  createWalletClient,
  http,
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

import type { Abi } from "viem";
import hotelFactoryJson from "../../../out/HotelTokenFactory.sol/HotelTokenFactory.json";

const hotelFactoryAbi: Abi = hotelFactoryJson.abi as Abi;

const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS as `0x${string}`;

// ----------------------
// LAZY ACCOUNT CREATION (FIX)
// ----------------------
function getWallet() {
  const pk = process.env.PRIVATE_KEY;

  if (!pk) {
    throw new Error("PRIVATE_KEY missing in environment");
  }

  const account = privateKeyToAccount(pk as `0x${string}`);

  return createWalletClient({
    chain: base,
    transport: http(process.env.RPC_URL!),
    account,
  });
}

export const hotelFactory = {
  wallet: null as any, // we will initialize lazily

  public: createPublicClient({
    chain: base,
    transport: http(process.env.RPC_URL!),
  }),

  address: FACTORY_ADDRESS,
  abi: hotelFactoryAbi,

  getWallet,
};