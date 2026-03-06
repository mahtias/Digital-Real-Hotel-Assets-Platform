import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Contract ABI (only functions we need)
const ABI = [
  "function totalHotels() view returns (uint256)",
  "function getHotel(uint256) view returns (tuple(string hotelId,string name,string location,string imageUrl,address propertyOwner,address tokenContract,uint256 totalShares,uint256 pricePerShare,uint256 minimumInvestment,uint256 fundingDeadline,uint8 status,bool isVerified,uint256 createdAt))"
];


async function main() {
  try {
    const RPC_URL = process.env.RPC_URL as string;
    const MANAGER_ADDRESS = process.env.HOTEL_ASSET_MANAGER_ADDRESS as string;

    if (!RPC_URL || !MANAGER_ADDRESS) {
      throw new Error("Missing RPC_URL or HOTEL_ASSET_MANAGER_ADDRESS in .env");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const manager = new ethers.Contract(
      MANAGER_ADDRESS,
      ABI,
      provider
    );

    console.log("\n🔎 Checking deployed hotels...\n");

    const totalHotels = await manager.totalHotels();

    console.log("🏨 Total hotels on-chain:", totalHotels.toString(), "\n");

    if (Number(totalHotels) === 0) {
      console.log("No hotels deployed yet.");
      return;
    }

    for (let i = 1; i <= Number(totalHotels); i++) {
      try {
        const hotel = await manager.getHotel(i);

        console.log("------------------------------------------------");
        console.log(`🏨 Hotel Index: ${i}`);
        console.log(`🆔 Hotel UUID: ${hotel.hotelId}`);
        console.log(`🏷 Name: ${hotel.name}`);
        console.log(`📍 Location: ${hotel.location}`);
        console.log(`🏦 Property Owner: ${hotel.propertyOwner}`);
        console.log(`🪙 Token Address: ${hotel.tokenContract}`);
        console.log(`📊 Total Shares: ${hotel.totalShares.toString()}`);
        console.log(`💲 Price Per Share: ${hotel.pricePerShare.toString()}`);
        console.log(`✔ Verified: ${hotel.isVerified}`);
        console.log(`📌 Status: ${hotel.status}`);
        console.log("------------------------------------------------\n");

      } catch (error) {
        console.error(`❌ Failed to fetch hotel ${i}:`, error);
      }
    }

    console.log("✅ Check complete!\n");

  } catch (error) {
    console.error("❌ Script failed:", error);
  }
}

main();