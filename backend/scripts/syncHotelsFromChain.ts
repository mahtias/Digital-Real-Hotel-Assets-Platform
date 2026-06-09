import prisma from "../src/config/database";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const HOTEL_ASSET_MANAGER_ADDRESS = process.env.HOTEL_ASSET_MANAGER_ADDRESS!;
const RPC_URL = process.env.RPC_URL!;
const PROPERTY_OWNER_ADDRESS = process.env.TREASURY_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Minimal ABI for the calls we need
const hotelManagerAbi = [
  "function totalHotels() view returns (uint256)",
  "function getHotel(uint256) view returns (tuple(string hotelId,string name,string location,string imageUrl,address propertyOwner,address tokenAddress,uint256 totalShares,uint256 pricePerShare,uint256 minimumInvestment,uint256 fundingDuration,uint8 kycLevel,bool isVerified,uint256 blockchainId))"
];

const hotelDisplayMetadata: Record<string, { displaySymbol: string; imageUrl: string }> = {
  "hotel-001": {
    displaySymbol: "DRA-MHN",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
  },
  "hotel-002": {
    displaySymbol: "DRA-MBS",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
  },
  "hotel-003": {
    displaySymbol: "DRA-RCB",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  },
  "hotel-004": {
    displaySymbol: "DRA-GPH",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
  },
  "hotel-005": {
    displaySymbol: "DRA-WAM",
    imageUrl: "https://www.sbid.org/wp-content/uploads//2020/02/Hotel-design-by-Godwin-Austen-Johnson-2019-4.jpg"
  },
  "hotel-006": {
    displaySymbol: "DRA-MVL",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
  },
};

async function main() {
  const manager = new ethers.Contract(HOTEL_ASSET_MANAGER_ADDRESS, hotelManagerAbi, provider);

  const totalHotels: ethers.BigNumberish = await manager.totalHotels();

  console.log(`Found ${totalHotels} hotels on-chain.`);

  for (let i = 1; i <= Number(totalHotels); i++) {
    const hotel = await manager.getHotel(i);

    const metadata = hotelDisplayMetadata[hotel.hotelId] || { displaySymbol: hotel.hotelId, imageUrl: "" };

    console.log(`Syncing hotel: ${hotel.name}`);

 await prisma.hotelAsset.upsert({
  where: {
    blockchainId: i,
  },

  update: {
    name: hotel.name,
    location: hotel.location,
    status: "FUNDRAISING",
    imageUrl: metadata.imageUrl,
    tokenSymbol: metadata.displaySymbol,
    tokenAddress: hotel.tokenAddress,
    totalTokens: Number(hotel.totalShares),
    tokenPrice: Number(hotel.pricePerShare),
    tokensSold: 0,
    walletAddress: PROPERTY_OWNER_ADDRESS,
    updatedAt: new Date(),
  },

  create: {
    id: crypto.randomUUID(),
    name: hotel.name,
    location: hotel.location,
    status: "FUNDRAISING",
    imageUrl: metadata.imageUrl,
    tokenSymbol: metadata.displaySymbol,
    tokenAddress: hotel.tokenAddress,
    totalTokens: Number(hotel.totalShares),
    tokenPrice: Number(hotel.pricePerShare),
    tokensSold: 0,

    blockchainId: i,

    walletAddress: PROPERTY_OWNER_ADDRESS,
    createdById: "caa158ba-5e09-4176-bce0-369ad9ae4638",
    createdAt: new Date(),
  },
});

    console.log(`✅ Synced: ${hotel.name} (${metadata.displaySymbol})`);
  }

  console.log("All hotels synced successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });