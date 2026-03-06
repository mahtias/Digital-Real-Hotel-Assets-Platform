import { 
  createPublicClient, 
  createWalletClient, 
  http 
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

import type { Abi } from "viem";

import hatJson from "../../../out/HotelAssetToken.sol/HotelAssetToken.json";

const hatAbi: Abi = hatJson.abi as Abi;
console.log("DEBUG PRIVATE KEY:", process.env.PRIVATE_KEY);
const HAT_CONTRACT = process.env.HAT_CONTRACT_ADDRESS as `0x${string}`;
const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);


export const hat: any = {
  wallet: createWalletClient({
    chain: base,
    transport: http(process.env.RPC_URL!),
    account,
  }),

  public: createPublicClient({
    chain: base,
    transport: http(process.env.RPC_URL!),
  }),

  address: HAT_CONTRACT,
  abi: hatAbi,
};  
