import { ethers } from "ethers";
import HotelTokenFactoryJson from "../../../out/HotelTokenFactory.sol/HotelTokenFactory.json";

const FACTORY_ABI = HotelTokenFactoryJson.abi;
const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS!;

function getProvider(): ethers.JsonRpcProvider {
  const rpc = process.env.RPC_URL || process.env.BASE_SEPOLIA_RPC;
  if (!rpc) throw new Error("Missing RPC_URL environment variable");
  return new ethers.JsonRpcProvider(rpc);
}

function getWallet(): ethers.Wallet {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing in environment");
  return new ethers.Wallet(pk, getProvider());
}

function getContract(runner?: ethers.ContractRunner): ethers.Contract {
  return new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, runner ?? getProvider());
}

export const hotelFactory = {
  getContract,
  getWallet,
  getProvider,
  address: FACTORY_ADDRESS,
  abi: FACTORY_ABI,
};
