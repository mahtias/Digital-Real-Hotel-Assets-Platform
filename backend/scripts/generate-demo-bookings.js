import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// 🔌 Load environment variables from your backend folder
// If this script is in a 'scripts' subfolder, use dotenv.config({ path: '../.env' });
dotenv.config({ path: "./.env" }); 

// =========================================================================
// ⚙️ BASE CONFIGURATIONS (Sourced dynamically from your .env)
// =========================================================================
const API_URL = process.env.API_URL || "http://localhost:5000"; 
const RPC_URL = process.env.RPC_URL || "https://base-sepolia.g.alchemy.com/v2/w4sdyVuAlr44h9jRAE08y";
const USDC_CONTRACT_ADDRESS = process.env.USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; 
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
  console.error("❌ CRITICAL ERROR: JWT_SECRET is missing from your .env file!");
  process.exit(1);
}


const provider = new ethers.JsonRpcProvider(RPC_URL);

// 👥 Sourcing verified users via environment private keys
const USERS = [
  {
    id: process.env.USER_A_DATABASE_ID, // Add this string key mapping to your backend .env
    role: "USER", 
    privateKey: process.env.USER_A_PRIVATE_KEY 
  },
  {
    id: process.env.USER_B_DATABASE_ID, // Add this string key mapping to your backend .env
    role: "USER",
    privateKey: process.env.USER_B_PRIVATE_KEY
  }
];

// Validate that users are loaded successfully
if (!USERS[0].id || !USERS[0].privateKey || !USERS[1].id || !USERS[1].privateKey) {
  console.error("❌ CRITICAL ERROR: User database IDs or Private Keys are missing from your .env file!");
  process.exit(1);
}

// 🏨 Asset list linked directly to your active setup
const HOTELS = [
  {
    id: process.env.HOTEL_MOUNTAIN_ID, 
    roomTypes: [
      { name: "standard", price: 0.5 },
      { name: "deluxe", price: 1.0 },
      { name: "executive", price: 1.5 },
      { name: "suite", price: 2.0 }
    ],
    nextAvailableDayOffset: 1 
  },
  {
    id: process.env.HOTEL_MARINA_BAY_ID, // Add this string key mapping to your backend .env
    roomTypes: [
      { name: "standard", price: 0.5 },
      { name: "deluxe", price: 1.0 },
      { name: "executive", price: 1.5 },
      { name: "suite", price: 2.0 }
    ],
    nextAvailableDayOffset: 1
  }
];

if (!HOTELS[1].id) {
  console.error("❌ CRITICAL ERROR: HOTEL_MOUNTAIN_ID is missing from your .env file!");
  process.exit(1);
}

const ERC20_ABI = ["function transfer(address to, uint256 value) external returns (bool)"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// =========================================================================
// 🔑 AUTH TOKEN GENERATION HELPER
// =========================================================================
function generateMockUserToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
}

// =========================================================================
// ⏱️ CORE AUTOMATED BOOKING TRIGGER
// =========================================================================
async function triggerAutomatedBooking() {
  const activeUser = getRandomElement(USERS);
  const targetHotel = getRandomElement(HOTELS); 
  const selectedRoom = getRandomElement(targetHotel.roomTypes);
  
  const nights = getRandomInt(1, 4); 
  const guests = getRandomInt(1, 4);
  
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + targetHotel.nextAvailableDayOffset);
  
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + nights);

  const totalPrice = Number((nights * selectedRoom.price).toFixed(2));
  const authToken = generateMockUserToken(activeUser.id, activeUser.role);

  console.log(`\n[⏱️] Running automated script loop for User: ${activeUser.id.substring(0,8)}...`);
  console.log(`    🏨 Hotel: ${targetHotel.id.substring(0,8)}... | Room: ${selectedRoom.name}`);
  console.log(`    📅 Check-in: ${checkInDate.toISOString().split('T')[0]} | Check-out: ${checkOutDate.toISOString().split('T')[0]}`);
  console.log(`    💰 Cost: $${totalPrice} USDC`);

  try {
    // ---------------------------------------------------------------------
    // STEP 1: Create PENDING database booking
    // ---------------------------------------------------------------------
    const createRes = await fetch(`${API_URL}/api/v1/bookings`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({
        userId: activeUser.id,
        hotelAssetId: targetHotel.id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice: totalPrice,
        roomType: selectedRoom.name,
        guests: guests,
        discountApplied: 0,
        paymentMethod: "USDC"
      }),
    });

    const createResult = await createRes.json();
    if (!createResult.success) {
      throw new Error(`Booking creation rejected by Prisma filter: ${createResult.message || createResult.error}`);
    }

    const bookingId = createResult.data.id;
    console.log(`    ✅ Step 1: Database reservation stored (ID: ${bookingId.substring(0,8)}...)`);

    // ---------------------------------------------------------------------
    // STEP 2: Create Payment Intent
    // ---------------------------------------------------------------------
    const intentRes = await fetch(`${API_URL}/api/v1/payments/intent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ bookingId }),
    });

    const intentResult = await intentRes.json();
    if (!intentResult.success) {
      throw new Error(`Payment intent generation dropped: ${intentResult.error}`);
    }

    const { intentId, amount, receiver } = intentResult;
    console.log(`    ✅ Step 2: Payment Intent Created (ID: ${intentId.substring(0,8)}... | Amount: ${amount})`);

    // ---------------------------------------------------------------------
    // STEP 3: Sign & Broadcast Live Blockchain Transaction
    // ---------------------------------------------------------------------
    console.log(`    ⚡ Broadcasting live transaction to Base Sepolia...`);
    const wallet = new ethers.Wallet(activeUser.privateKey, provider);
    const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, wallet);
    
    const transferAmount = ethers.parseUnits(amount.toString(), 6);
    const tx = await usdcContract.transfer(receiver, transferAmount);
    console.log(`    🔗 Sent! Transaction Hash: ${tx.hash}`);
    
    await tx.wait();
    console.log(`    ✅ Step 3: On-chain transaction mined into block.`);

    // ---------------------------------------------------------------------
    // STEP 4: Confirm Payment & Complete QloApps Handshake
    // ---------------------------------------------------------------------
    console.log(`    🔄 Executing payment confirmation webhook...`);
    const confirmRes = await fetch(`${API_URL}/api/v1/payments/confirm`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ intentId, txHash: tx.hash }),
    });

    const confirmResult = await confirmRes.json();
    if (!confirmResult.success) {
      throw new Error(`Payment verification dropped at handler: ${confirmResult.error || confirmResult.message}`);
    }

    console.log(`    🎉 SUCCESS: QloApps PMS status returned: [${confirmResult.data?.pmsSync || "SUCCESS"}]`);

    targetHotel.nextAvailableDayOffset += (nights + 1);

  } catch (error) {
    console.error(`    ❌ Loop Run Aborted: ${error.message}`);
    targetHotel.nextAvailableDayOffset += 2; 
  }
}

// =========================================================================
// ⏳ CRON SCHEDULER INITIALIZATION
// =========================================================================
console.log("====================================================");
console.log("🏨 STARTING ENV-LINKED LIVE QLOAPPS DATA FEEDER");
console.log("   Firing interval target: 1 fresh booking / 60 seconds");
console.log("====================================================");

triggerAutomatedBooking();
setInterval(triggerAutomatedBooking, 60000);