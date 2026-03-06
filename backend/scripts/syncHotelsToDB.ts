import { ethers } from "ethers";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Blockchain ABI
const ABI = [
  "function totalHotels() view returns (uint256)",
  "function getHotel(uint256) view returns (tuple(string hotelId,string name,string location,string imageUrl,address propertyOwner,address tokenContract,uint256 totalShares,uint256 pricePerShare,uint256 minimumInvestment,uint256 fundingDeadline,uint8 status,bool isVerified,uint256 createdAt))"
];

// Map numeric on-chain status to Prisma AssetStatus enum
const STATUS_MAP: Record<number, string> = {
  0: "UPCOMING",
  1: "FUNDRAISING",
  2: "ACTIVE",
  3: "CLOSED"
};

// Your frontend-registered user ID
const CREATED_BY_ID = "85b6e6b2-b96e-4a40-8d2a-95fa16d32159";

// Max safe integer for Prisma Int (32-bit signed)
const MAX_INT = 2_147_483_647;

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const manager = new ethers.Contract(
    process.env.HOTEL_ASSET_MANAGER_ADDRESS!,
    ABI,
    provider
  );

  const total = await manager.totalHotels();
  console.log("🏨 Hotels on chain:", total.toString());

  for (let i = 1; i <= Number(total); i++) {
    const hotel = await manager.getHotel(i);
    console.log(`\n📦 Syncing hotel ${i}: ${hotel.name}`);

    // Ensure values fit Prisma Int limits
    const safeTotalTokens = Number(hotel.totalShares) > MAX_INT ? MAX_INT : Number(hotel.totalShares);
    const safeTokenPrice = Number(hotel.pricePerShare) > MAX_INT ? MAX_INT : Number(hotel.pricePerShare);

    try {
      await axios.post(
        `${process.env.API_URL}/api/v1/hotels`,
        {
          blockchainId: i,
          name: hotel.name,
          location: hotel.location,
          imageUrl: hotel.imageUrl || null,
          tokenAddress: hotel.tokenContract || null,
          totalTokens: safeTotalTokens,
          tokenPrice: safeTokenPrice,
          status: STATUS_MAP[Number(hotel.status)] || "UPCOMING",
          isVerified: hotel.isVerified,
          createdById: CREATED_BY_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.BACKEND_ADMIN_TOKEN}`
          }
        }
      );

      console.log("✅ Saved to backend:", hotel.name);
    } catch (err: any) {
      console.log("❌ Failed saving:", err.response?.data || err.message);
    }
  }

  console.log("\n🎉 Sync finished!");
}

main();