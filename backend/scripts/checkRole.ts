import { ethers } from "ethers";
import HotelAssetManagerJSON from "../../out/HotelAssetManager.sol/HotelAssetManager.json";
import dotenv from "dotenv";
dotenv.config();

const HotelAssetManagerAbi = HotelAssetManagerJSON.abi;
async function checkRole() {

  const RPC_URL = process.env.RPC_URL!;
  const PRIVATE_KEY = process.env.PRIVATE_KEY!;
  const CONTRACT_ADDRESS = process.env.HOTEL_ASSET_MANAGER_ADDRESS!;

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    HotelAssetManagerAbi,
    wallet
  );

  console.log("Wallet:", wallet.address);
  console.log("Contract:", CONTRACT_ADDRESS);

  // Calculate role hash
  const role = ethers.keccak256(
    ethers.toUtf8Bytes("ASSET_MANAGER_ROLE")
  );

  console.log("ASSET_MANAGER_ROLE hash:", role);

  const hasRole = await contract.hasRole(role, wallet.address);

  console.log("Has ASSET_MANAGER_ROLE:", hasRole);
}

checkRole().catch(console.error);