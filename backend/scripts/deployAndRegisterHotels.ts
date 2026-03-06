import { ethers } from "ethers";
import axios from "axios";
import HotelAssetManagerJSON from "../../out/HotelAssetManager.sol/HotelAssetManager.json";
import dotenv from "dotenv";

dotenv.config();

// ────────────────────────────────────────────────
// Environment & Constants
// ────────────────────────────────────────────────
const HOTEL_ASSET_MANAGER_ADDRESS = "0x572C8046A079F5782405212c17C44cA74eF9c4Ed";
const HotelAssetManagerAbi = HotelAssetManagerJSON.abi;

["RPC_URL", "PRIVATE_KEY", "API_URL"].forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is missing in .env file`);
  }
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const manager = new ethers.Contract(
  HOTEL_ASSET_MANAGER_ADDRESS,
  HotelAssetManagerAbi,
  wallet
);

// ────────────────────────────────────────────────
// Types & Interfaces
// ────────────────────────────────────────────────
interface HotelListedEvent {
  name: "HotelListed";
  args: {
    hotelIndex: bigint;
    tokenContract: string;
    // ... other args if needed
  };
}

// ────────────────────────────────────────────────
// Main Function
// ────────────────────────────────────────────────
async function deployAndRegisterHotels() {
  console.log("Using wallet:", wallet.address);
  console.log("Manager contract:", HOTEL_ASSET_MANAGER_ADDRESS);

  for (let i = 1; i <= 4; i++) {
    console.log(`\n───────────────────────────────────────────────`);
    console.log(`🚀 Deploying Hotel ${i}...`);

    try {
      // ─── 1. Check if hotel already exists ───
      try {
        const hotel = await manager.getHotel(i);
        if (hotel.tokenContract !== ethers.ZeroAddress) {
          console.log(`⚠️ Hotel ${i} already exists (token: ${hotel.tokenContract}) - skipping`);
          continue;
        }
      } catch {
        // getHotel reverts → hotel doesn't exist → proceed
      }

      // ─── 2. Call listHotel ───
      const tx = await manager.listHotel(
        `hotel-${i}`,                          // slug / hotelId string
        `Hotel ${i}`,                          // name
        `City ${i}`,                           // location
        `https://picsum.photos/seed/hotel${i}/1200/800`, // imageUrl
        `HTL${i}`,                             // symbol
        wallet.address,                        // propertyOwner
        1_000_000n,                            // totalShares
        20n,                                   // pricePerShare
        1000n,                                 // minimumInvestment
        60n * 60n * 24n * 90n,                 // fundingDuration (90 days in seconds)
        1                                      // kycLevel: BASIC
      );

      console.log(`Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`✅ Tx mined: ${receipt?.transactionHash}`);

      // ─── 3. Parse HotelListed event ───
      const hotelEvent = receipt?.logs
  .map((log: ethers.Log) => {
    try {
      return manager.interface.parseLog(log);
    } catch {
    return null;
    }
  })
  .find(
  (e: ethers.Result | null): e is ethers.Result & { name: "HotelListed" } =>
    e !== null && e.name === "HotelListed"
)

      let hotelIndex: number;
      let tokenAddress: string;

      if (hotelEvent) {
        hotelIndex = Number(hotelEvent.args.hotelIndex);
        tokenAddress = hotelEvent.args.tokenContract;
      } else {
        console.warn(`⚠️ HotelListed event not found - assuming index ${i}`);
        hotelIndex = i;
        tokenAddress = ethers.ZeroAddress; // fallback - update manually if needed
      }

      console.log(`🏨 Index: ${hotelIndex}`);
      console.log(`🏷 Token: ${tokenAddress}`);

      // ─── 4. Save to backend ───
      try {
        const payload = {
          name: `Hotel ${i}`,
          symbol: `HTL${i}`,
          tokenAddress,                     // important!
          blockchainId: hotelIndex,
          status: "ACTIVE",
          description: `Invest in Hotel ${i}`,
          location: `City ${i}`,
          imageUrl: `https://picsum.photos/seed/hotel${i}/1200/800`,
        };

        const response = await axios.post(
          `${process.env.API_URL}/api/v1/hotels`,
          payload,
          { timeout: 10000 }
        );

        console.log("💾 Saved to backend DB:", response.data);
      } catch (axiosError: any) {
        console.error(
          `❌ Failed to save Hotel ${i} to backend:`,
          axiosError.response?.data || axiosError.message || axiosError
        );
      }

      // Optional: small delay to avoid rate limits
      if (i < 4) {
        await new Promise((r) => setTimeout(r, 5000)); // 5 seconds
      }

    } catch (error: any) {
      console.error(
        `❌ Deployment failed for Hotel ${i}:`,
        error.shortMessage || error.message || error.reason || error
      );
      if (error.data) console.error("Revert data:", error.data);
    }
  }

  console.log("\n🎉 All hotels deployment script finished!");
}

deployAndRegisterHotels()
  .catch((err) => {
    console.error("❌ Script crashed:", err);
    process.exit(1);
  });