import { ethers } from "ethers";
import hatJson from "../../../out/HotelAssetToken.sol/HotelAssetToken.json";

const hatAbi = hatJson.abi;
const HAT_CONTRACT = process.env.HAT_CONTRACT_ADDRESS!;

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
  return new ethers.Contract(HAT_CONTRACT, hatAbi, runner ?? getProvider());
}

export const hat = {
  getContract,
  getWallet,
  getProvider,
  address: HAT_CONTRACT,
  abi: hatAbi,
};
