import prisma from "../src/config/database";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { AssetStatus, Prisma } from "@prisma/client"; // Use Prisma.Decimal

dotenv.config();

// ABI with totalHotels() and getHotel() only
const ABI = [
  "function totalHotels() view returns (uint256)",
  "function getHotel(uint256) view returns (tuple(string hotelId,string name,string location,string imageUrl,address propertyOwner,address tokenContract,uint256 totalShares,uint256 pricePerShare,uint256 minimumInvestment,uint256 fundingDeadline,uint8 status,bool isVerified,uint256 createdAt))"
];

// Map on-chain numeric status to Prisma enum
const STATUS_MAP: Record<number, AssetStatus> = {
  0: AssetStatus.UPCOMING,
  1: AssetStatus.FUNDRAISING,
  2: AssetStatus.ACTIVE,
  3: AssetStatus.CLOSED,
};

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const manager = new ethers.Contract(
    process.env.HOTEL_ASSET_MANAGER_ADDRESS!,
    ABI,
    provider
  );

  const total = await manager.totalHotels();
  console.log("🏨 Total hotels on-chain:", total.toString());

  for (let i = 1; i <= Number(total); i++) {
    const hotel = await manager.getHotel(i);

    const tokenAddress = hotel.tokenContract.toLowerCase();
    const status = STATUS_MAP[Number(hotel.status)] || AssetStatus.UPCOMING;

    console.log(`\n🔄 Syncing hotel ${i}: ${hotel.name}`);
    console.log(`Token: ${tokenAddress}, Status: ${status}`);

    try {
      const updated = await prisma.hotelAsset.updateMany({
        where: { tokenAddress },
        data: {
          blockchainId: i,
          status,
          name: hotel.name,
          imageUrl: hotel.imageUrl || null,
          totalTokens: new Prisma.Decimal(hotel.totalShares.toString()), // ✅ Correct
          tokenPrice: Number(hotel.pricePerShare) || 0,
          //isVerified: hotel.isVerified,
        },
      });

      if (updated.count > 0) {
        console.log(` ✅ Updated ${updated.count} row(s) in DB`);
      } else {
        console.log(` ⚠️ No DB row found for token ${tokenAddress}`);
      }
    } catch (error: any) {
      console.error(`❌ Failed to update token ${tokenAddress}:`, error.message);
    }
  }

  console.log("\n🎉 Sync finished!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});