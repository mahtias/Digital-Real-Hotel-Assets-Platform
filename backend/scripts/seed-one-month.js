import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const API_URL = process.env.API_URL || "http://localhost:5000"; 
const RPC_URL = process.env.RPC_URL || "https://sepolia.base.org";
const USDC_CONTRACT_ADDRESS = process.env.USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; 
const JWT_SECRET = process.env.JWT_SECRET;

const provider = new ethers.JsonRpcProvider(RPC_URL);

const USERS = [
  { id: process.env.USER_A_DATABASE_ID, role: "USER", privateKey: process.env.USER_A_PRIVATE_KEY },
  { id: process.env.USER_B_DATABASE_ID, role: "USER", privateKey: process.env.USER_B_PRIVATE_KEY }
];

const HOTELS = [
  { id: process.env.HOTEL_MARINA_BAY_ID || "34ec2ece-f4a4-4124-97b3-34d9078c841d" },
  { id: process.env.HOTEL_MOUNTAIN_ID || "31f98998-86bf-470e-97bd-d4e9df11a658" }
];

const ERC20_ABI = ["function transfer(address to, uint256 value) external returns (bool)"];
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

//  Weighted Room Selection: 40% Deluxe, 35% Standard, 25% Random Fallback
function getWeightedRoomType() {
  const roll = Math.random() * 100; 
  if (roll <= 40) {
    return { name: "deluxe", price: 1.0 }; // 40% Chance
  } else if (roll <= 75) {
    return { name: "standard", price: 0.5 }; // 35% Chance
  } else {
    return Math.random() > 0.5 ? { name: "deluxe", price: 1.0 } : { name: "standard", price: 0.5 };
  }
}

function generateMockUserToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "10h" });
}


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWeightedSeeder() {
  console.log("====================================================");
  console.log("📊 STARTING WEIGHTED 200-BOOKING STATISTICAL SEEDER");
  console.log("📅 TIMEFRAME: 20 Days (June 10 -> June 30)");
  console.log("🎯 Target Mix: 40% Deluxe Rooms | 35% Standard Rooms");
  console.log("====================================================");

  const TOTAL_TARGET_BOOKINGS = 200;
  let successfulBookings = 0;

  while (successfulBookings < TOTAL_TARGET_BOOKINGS) {
    //  Modifies day distribution to 20 days max (0 to 19 days offset from June 10)
    const randomDayOffset = Math.floor(Math.random() * 20);
    
    // Calculate how many days are left in June from this check-in day
    const daysRemainingInMonth = 20 - randomDayOffset; 
    
    // Cap stay length (max 3 nights) so it never forces a checkout into July
    const maxAllowedStay = Math.min(3, daysRemainingInMonth);
    const stayDuration = maxAllowedStay > 1 ? Math.floor(Math.random() * maxAllowedStay) + 1 : 1;

    const targetHotel = getRandomElement(HOTELS);
    const room = getWeightedRoomType();
    const activeUser = getRandomElement(USERS);
    const authToken = generateMockUserToken(activeUser.id, activeUser.role);

    // Date generation starting explicitly from June 10
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + randomDayOffset);
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + stayDuration);

    const totalPrice = room.price * stayDuration;

    console.log(`\n [Progress: ${successfulBookings + 1}/${TOTAL_TARGET_BOOKINGS}]`);
    console.log(`🏨 Hotel: ${targetHotel.id.substring(0,8)}... | Room: ${room.name.padEnd(8)} | Nights: ${stayDuration} | Cost: $${totalPrice} USDC`);

    try {
      // STEP 1: Database reservation allocation
      const createRes = await fetch(`${API_URL}/api/v1/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({
          userId: activeUser.id,
          hotelAssetId: targetHotel.id,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          totalPrice: totalPrice,
          roomType: room.name,
          guests: 2,
          discountApplied: 0,
          paymentMethod: "USDC"
        }),
      });
      const createResult = await createRes.json();
      if (!createResult.success) throw new Error(`Database Rejected Block: ${createResult.message}`);
      const bookingId = createResult.data.id;

      // STEP 2: Payment Intent Setup
      const intentRes = await fetch(`${API_URL}/api/v1/payments/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({ bookingId }),
      });
      const intentResult = await intentRes.json();
      if (!intentResult.success) throw new Error(`Intent Error: ${intentResult.error}`);
      const { intentId, amount, receiver } = intentResult;

      // STEP 3: Live Base Sepolia Transaction Signing
      const wallet = new ethers.Wallet(activeUser.privateKey, provider);
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, wallet);
      const transferAmount = ethers.parseUnits(amount.toString(), 6);
      
      const tx = await usdcContract.transfer(receiver, transferAmount);
      await tx.wait(); // Ensures nonces stay sequentially sound across nodes

      // STEP 4: Confirm Hook Callback back to QloApps production ID
      const confirmRes = await fetch(`${API_URL}/api/v1/payments/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
        body: JSON.stringify({ intentId, txHash: tx.hash }),
      });
      const confirmResult = await confirmRes.json();
      
      if (confirmResult.success) {
        console.log(` Success! Tx Mined, pushed cleanly into QloApps mapping.`);
        successfulBookings++;
      } else {
        console.error(` Saved in DB, but QloApps tracking rejected it: ${confirmResult.message}`);
      }

      // Keep RPC infrastructure connections cool
      await sleep(1500);

    } catch (error) {
      console.error(` Transaction block skipped: ${error.message}`);
      await sleep(4000); // Breathe space for network error cooling
    }
  }

  console.log("\n====================================================");
  console.log(`🎉 COMPLETED: ${successfulBookings} weighted bookings populated successfully for June!`);
  console.log("====================================================");
  process.exit(0);
}

runWeightedSeeder();