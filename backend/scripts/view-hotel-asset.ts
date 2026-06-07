import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import HotelAssetManagerABI from "../../out/HotelAssetManager.sol/HotelAssetManager.json";

const RPC_URL = process.env.BASE_SEPOLIA_RPC!;
const HOTEL_MANAGER_ADDRESS = process.env.HOTEL_ASSET_MANAGER_ADDRESS!;

async function main() {
  try {
    console.log("🏨 Connecting to HotelAssetManager...\n");

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const contract = new ethers.Contract(
      HOTEL_MANAGER_ADDRESS,
      HotelAssetManagerABI.abi,
      provider
    );

    const total = await contract.totalHotels();

    console.log(`📊 Total Hotels: ${total.toString()}\n`);

    for (let i = 1; i <= Number(total); i++) {
      console.log("=".repeat(60));
      console.log(`🏨 HOTEL ID: ${i}`);
      console.log("=".repeat(60));

      try {
        const hotel = await contract.getHotel(i);

        console.log(`🆔 Hotel UUID: ${hotel.hotelId}`);
        console.log(`🏢 Name: ${hotel.name}`);
        console.log(`📍 Location: ${hotel.location}`);
        console.log(`📸 Image: ${hotel.imageUrl}`);
        console.log(`👤 Owner: ${hotel.propertyOwner}`);
        console.log(`🪙 Token: ${hotel.tokenContract}`);

        // 🔥 IMPORTANT FIXED FIELDS
        console.log(`💰 Price Per Share: ${hotel.pricePerShare.toString()}`);
        console.log(`📦 Total Shares: ${hotel.totalShares.toString()}`);
        console.log(`💵 Min Investment: ${hotel.minimumInvestment.toString()}`);

        console.log(`📅 Created: ${new Date(Number(hotel.createdAt) * 1000)}`);

        console.log(`📊 Status: ${hotel.status}`);
        console.log(`✅ Verified: ${hotel.isVerified}`);

      } catch (err: any) {
        console.error(`❌ Error hotel ${i}:`, err.message);
      }

      console.log("\n");
    }
  } catch (error: any) {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  }
}

main();