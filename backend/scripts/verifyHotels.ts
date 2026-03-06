import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const ABI = [
  "function totalHotels() view returns (uint256)",
  "function verifyHotel(uint256 hotelIndex)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    provider
  );

  const manager = new ethers.Contract(
    process.env.HOTEL_ASSET_MANAGER_ADDRESS!,
    ABI,
    wallet
  );

  const total = await manager.totalHotels();

  console.log("🏨 Total hotels:", total.toString());

  for (let i = 2; i <= Number(total); i++) {
    try {
      console.log(`\n🔍 Verifying hotel ${i}...`);

      const tx = await manager.verifyHotel(i);
      console.log("⏳ Waiting for tx:", tx.hash);

      await tx.wait();

      console.log(`✅ Hotel ${i} verified`);
    } catch (err: any) {
      console.log(`❌ Failed verifying hotel ${i}:`, err.reason || err.message);
    }
  }

  console.log("\n🎉 Verification complete!");
}

main();