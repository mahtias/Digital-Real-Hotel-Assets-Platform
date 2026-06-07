import {
  decodeEventLog,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import factoryJson from "../../out/HotelTokenFactory.sol/HotelTokenFactory.json";
import fs from "fs";
import path from "path";
import prisma from "../src/config/database";
import { randomUUID } from "crypto";

// --------------------
// ENV LOADER
// --------------------
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const envFile = fs.readFileSync(envPath, "utf8");

  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const [k, ...v] = trimmed.split("=");
    process.env[k] ||= v.join("=");
  });
}

loadEnv();

// --------------------
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS!;
const TREASURY = process.env.TREASURY_ADDRESS as `0x${string}`;

if (!RPC_URL || !PRIVATE_KEY || !FACTORY_ADDRESS || !TREASURY) {
  throw new Error("Missing env variables");
}

// --------------------
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const wallet = createWalletClient({
  account,
  chain: base,
  transport: http(RPC_URL),
});

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

const FACTORY_ABI = factoryJson.abi;

// --------------------
// INPUT
// --------------------
const payload = {
  name: "Marina Bay Sands",
  location: "Singapore",
  symbol: "MBS",
  totalTokens: 1_000_000,
  tokenPrice: 500,
};

// --------------------
function normalizePrice(price: number) {
  return BigInt(price) * 1_000_000n;
}

const pricePerShare = normalizePrice(payload.tokenPrice);

// --------------------
const HOTEL_ID = randomUUID();

// --------------------
async function main() {

  // ✅ GET REAL USER FROM DB
  const user = await prisma.user.findUnique({
    where: {
      email: "adonikadjo@hotmail.com",
    },
  });

  if (!user) throw new Error("User not found");

  const createdById = user.id;

  console.log("🚀 Deploying hotel...");

  const hash = await wallet.writeContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: "deployHotelToken",
    args: [
      HOTEL_ID,
      payload.name,
      payload.location,
      payload.symbol,
      BigInt(payload.totalTokens),
      pricePerShare,
      TREASURY,
      0,
    ],
  });

  console.log("TX:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const log = receipt.logs.find((l: any) => {
    try {
      const d: any = decodeEventLog({
        abi: FACTORY_ABI,
        data: l.data,
        topics: l.topics,
      });
      return d.eventName === "TokenDeployed";
    } catch {
      return false;
    }
  });

  if (!log) throw new Error("TokenDeployed not found");

  const decoded: any = decodeEventLog({
    abi: FACTORY_ABI,
    data: log.data,
    topics: log.topics,
  });

  const tokenAddress = decoded.args.tokenAddress as `0x${string}`;

  await prisma.hotelAsset.upsert({
    where: { id: HOTEL_ID },

    update: {
      tokenAddress,
      status: "FUNDRAISING",
    },

    create: {
      id: HOTEL_ID,
      name: payload.name,
      location: payload.location,
      tokenSymbol: payload.symbol,
      totalTokens: Number(payload.totalTokens),
      tokenPrice: Number(payload.tokenPrice),
      tokenAddress,
      status: "FUNDRAISING",
      createdById,
    },
  });

  console.log("✅ DONE");
  console.log("Token:", tokenAddress);
}

main().catch((e) => {
  console.error("❌ FAILED:", e);
});