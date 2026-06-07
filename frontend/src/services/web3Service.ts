// frontend/services/web3Service.ts
import { BrowserProvider, Contract, ethers, JsonRpcSigner, Signer } from "ethers";
import HotelInvestmentJSON from "../contracts/ABI/HotelInvestment.json";
import HotelAssetManagerJSON from "../contracts/ABI/HotelAssetManager.json";
//import KYCRegistryJSON from "../contracts/ABI/KYCRegistry.json";

//import axios from "axios";
import apiClient from "@/api/apiClient";
import { globalEvent } from '@/utils/events';
//const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 

const HotelInvestmentABI = HotelInvestmentJSON.abi;
const HotelAssetManagerABI = HotelAssetManagerJSON.abi;
//const KYC_ABI = KYCRegistryJSON.abi;
export const KYC_ABI = [
  {
    inputs: [
      { name: "level", type: "uint8" },
      { name: "documentHash", type: "bytes32" }
    ],
    name: "submitKYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "isKYCVerified",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserKYCLevel",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

const HOTEL_INVESTMENT_ADDRESS =
  import.meta.env.VITE_HOTEL_INVESTMENT_CONTRACT_ADDRESS ?? "";
const KYC_CONTRACT_ADDRESS = import.meta.env.VITE_KYC_CONTRACT_ADDRESS ?? "";
const HOTEL_ASSET_MANAGER_ADDRESS =
  import.meta.env.VITE_HOTEL_ASSET_MANAGER_ADDRESS ?? "";

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | Signer | null = null;
  private kycContract: Contract | null = null;

  constructor() {
    if (this.isMetaMaskInstalled()) this.setupListeners();
  }
  
  getAssetManagerContract() {
  if (!this.signer) throw new Error("Wallet not connected.");
  if (!HOTEL_ASSET_MANAGER_ADDRESS) throw new Error("Missing AssetManager address");
  return new Contract(
    HOTEL_ASSET_MANAGER_ADDRESS,
    HotelAssetManagerABI,
    this.signer
  );
}

async getHotel(hotelId: number) {
  const contract = this.getAssetManagerContract();

  const hotel = await contract.getHotel(hotelId);
  return {
    hotelId: Number(hotel.hotelId),
    name: hotel.name,
    location: hotel.location,
    imageUrl: hotel.imageUrl,
    propertyOwner: hotel.propertyOwner,
    tokenContract: hotel.tokenContract,
    totalShares: hotel.totalShares.toString(),
    pricePerShare: hotel.pricePerShare.toString(),
    minimumInvestment: hotel.minimumInvestment.toString(),
    fundingDeadline: Number(hotel.fundingDeadline),
    status: Number(hotel.status),
    isVerified: hotel.isVerified,
    createdAt: Number(hotel.createdAt)
  };
}

async previewShares(hotelId: number, amount: number) {
  const contract = this.getAssetManagerContract();
const amountWei = ethers.parseUnits(amount.toString(), 6);

  const shares = await contract.previewShares(hotelId, amountWei);

  return shares.toString();
}
  // -------------------
  // WALLET & PROVIDER  
  // -------------------

  
  isMetaMaskInstalled(): boolean {
    return typeof window !== "undefined" && window.ethereum?.isMetaMask === true;
  }

  private getEthereumProvider() {
    if (!window.ethereum) throw new Error("MetaMask not installed.");
    return window.ethereum;
  }
   
  private setupListeners() {
    if (!window.ethereum) return;

    window.ethereum.on?.("accountsChanged", () => this.disconnect());
    window.ethereum.on?.("chainChanged", () => window.location.reload());
  }

  /** Use an existing signer (from Wagmi or another source) */
  async setSigner(signer: Signer) {
    this.signer = signer;

    // If provider not set, try to get from signer
    if (!this.provider && "provider" in signer) {
      this.provider = signer.provider as BrowserProvider;
    }

    // Initialize KYC contract with this signer
    this.kycContract = new Contract(KYC_CONTRACT_ADDRESS, KYC_ABI, this.signer);
  }

  async getCurrentAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.kycContract = null;
  }

  // -------------------
  // KYC METHODS
  // -------------------

 async submitKYC(documentHash: string, level: number = 1): Promise<string> {
  if (!this.kycContract || !this.signer) {
    throw new Error("Wallet not connected.");
  }

  // Ensure hash is bytes32
  const padded = documentHash.startsWith("0x")
    ? documentHash
    : "0x" + documentHash;

  const hash32 = ethers.zeroPadValue(padded, 32);

  console.log("Submitting KYC:", {
    level,
    hash32
  });

  const tx = await this.kycContract.submitKYC(level, hash32);

  console.log("KYC tx sent:", tx.hash);

  const receipt = await tx.wait();

  console.log("KYC confirmed:", receipt.hash);

  return receipt.hash;
}

  async getUserKYCLevel(address: string): Promise<number> {
    if (!this.kycContract) throw new Error("Contract not initialized.");
    return Number(await this.kycContract.getUserKYCLevel(address));
  }

  async isKYCVerified(address: string): Promise<boolean> {
    if (!this.kycContract) throw new Error("Contract not initialized.");
    return await this.kycContract.isKYCVerified(address);
  }

  // -------------------
  // HOTEL INVESTMENT WITH STABLECOIN
  // -------------------
async investOnBlockchain(
   investmentId: string,
  blockchainId: number,
  dbHotelId: string,
  amount: number,
  stablecoin: {
    address: string;
    decimals: number;
  }
) {
  if (!this.signer) throw new Error("Wallet not connected.");

  const userAddress = await this.signer.getAddress();

  if (!stablecoin?.address) {
    throw new Error("Stablecoin address not provided");
  }

  const hotelContract = new Contract(
    HOTEL_INVESTMENT_ADDRESS,
    HotelInvestmentABI,
    this.signer
  );

  // 🧠 DYNAMIC TOKEN (NO MORE USDC HARDCODE)
  const tokenContract = new Contract(
    stablecoin.address,
    ERC20_ABI,
    this.signer
  );

  // 💱 Convert using dynamic decimals
  const amountWei = ethers.parseUnits(
    amount.toString(),
    stablecoin.decimals
  );

  console.log("User:", userAddress);
  console.log("Token:", stablecoin.address);
  console.log("Amount:", amountWei.toString());

  // -----------------------------
  // 1️⃣ CHECK BALANCE
  // -----------------------------
  const balance = await tokenContract.balanceOf(userAddress);

  if (BigInt(balance) < BigInt(amountWei)) {
    throw new Error("Insufficient token balance");
  }

  // -----------------------------
  // 2️⃣ CHECK ALLOWANCE
  // -----------------------------
  const allowance = await tokenContract.allowance(
    userAddress,
    HOTEL_INVESTMENT_ADDRESS
  );

  console.log("Current allowance:", allowance.toString());

  // -----------------------------
  // 3️⃣ APPROVE IF NEEDED
  // -----------------------------
  if (allowance < amountWei) {
    console.log("Approving token...");

    const approveTx = await tokenContract.approve(
      HOTEL_INVESTMENT_ADDRESS,
      amountWei
    );

    console.log("Approve tx:", approveTx.hash);

    await approveTx.wait();

    console.log("Token approved");
  }

  // -----------------------------
  // 4️⃣ INVEST
  // -----------------------------
const supported = await hotelContract.supportedStablecoins(
   stablecoin.address
);

console.log(
   "Stablecoin supported:",
   stablecoin.address,
   supported
);

const canInvest = await hotelContract.canUserInvest(
   userAddress,
   blockchainId
);

console.log("Can invest:", canInvest);

console.log("blockchainId:", blockchainId);
console.log("dbHotelId:", dbHotelId);

const assetManager = new Contract(
  HOTEL_ASSET_MANAGER_ADDRESS,
  HotelAssetManagerABI,
  this.signer
);

try {
  const hotel = await assetManager.getHotel(blockchainId);

  console.log("ONCHAIN HOTEL:", {
    owner: hotel.propertyOwner,
    tokenContract: hotel.tokenContract,
    totalShares: hotel.totalShares?.toString(),
    pricePerShare: hotel.pricePerShare?.toString(),
    minimumInvestment: hotel.minimumInvestment?.toString(),
    verified: hotel.isVerified
  });
} catch (err) {
  console.error("FAILED TO LOAD HOTEL:", err);
}

console.log("Sending invest transaction...");

const tx = await hotelContract.invest(
   blockchainId,
   stablecoin.address,
   amountWei
);

  console.log("Invest tx:", tx.hash);

  const receipt = await tx.wait();

  console.log("Investment confirmed:", receipt.hash);

  // -----------------------------
  // 5️⃣ BACKEND CONFIRMATION
  // -----------------------------
 await apiClient.post("/investments/confirm", {
  investmentId,
  hotelId: dbHotelId,
  amount,
  tokenAddress: stablecoin.address,
  blockchainTxHash: receipt.hash
});

  // -----------------------------
  // 6️⃣ FRONTEND EVENT
  // -----------------------------
  globalEvent.emit("investmentAdded", {
    hotelId: dbHotelId,
    amount,
    token: stablecoin.address
  });

  return receipt;
}

// -------------------
// HOTEL BOOKING PAYMENT WITH STABLECOIN LIKE USDC// 
// -------------------
async payBooking(
  bookingId: string,
  amount: number,
  receiver: string,
  stablecoin: {
    address: string;
    decimals: number;
  },
  registeredWallet?: string
) {
  if (!this.signer) throw new Error("Wallet not connected.");

  const userAddress = (await this.signer.getAddress()).toLowerCase();

  // -----------------------------
  // WALLET CHECK
  // -----------------------------
  if (registeredWallet && userAddress !== registeredWallet.toLowerCase()) {
    throw new Error(
      `Connected wallet (${userAddress}) does not match registered wallet (${registeredWallet})`
    );
  }

  if (!stablecoin?.address) {
    throw new Error("Stablecoin not provided");
  }

  const tokenContract = new Contract(
    stablecoin.address,
    ERC20_ABI,
    this.signer
  );

  const amountWei = ethers.parseUnits(
    amount.toString(),
    stablecoin.decimals
  );

  console.log("Booking payment");
  console.log("User:", userAddress);
  console.log("Token:", stablecoin.address);
  console.log("Amount:", amountWei.toString());

  // -----------------------------
  // CHECK BALANCE
  // -----------------------------
  const balance = await tokenContract.balanceOf(userAddress);

  if (balance < amountWei) {
    throw new Error("Insufficient token balance");
  }

  // -----------------------------
  // CHECK ALLOWANCE
  // -----------------------------
  const allowance = await tokenContract.allowance(
    userAddress,
    receiver
  );

  console.log("Allowance:", allowance.toString());

  // ⚠️ Booking uses direct transfer → no approve needed
  // (ERC20 transfer does NOT require allowance)

  // -----------------------------
  // SEND PAYMENT
  // -----------------------------
  console.log("Sending payment...");

  const tx = await tokenContract.transfer(
    receiver,
    amountWei
  );

  console.log("Payment tx:", tx.hash);

  const receipt = await tx.wait();

  console.log("Payment confirmed:", receipt.hash);

  // -----------------------------
  // CONFIRM BOOKING BACKEND
  // -----------------------------
  await apiClient.post("/bookings/confirm-payment", {
    bookingId,
    txHash: receipt.hash,
    tokenAddress: stablecoin.address,
    amount
  });

  return receipt;
}

// -----------------------------
// SEND USDC (x402 - PURE TRANSFER ONLY)
// -----------------------------
async sendStablecoin(
  receiver: string,
  amount: number,
  stablecoin: {
    address: string;
    decimals: number;
  }
): Promise<string> {
  if (!this.signer) throw new Error("Wallet not connected.");

  const userAddress = await this.signer.getAddress();

  if (!stablecoin?.address) {
    throw new Error("Stablecoin not provided");
  }

  const tokenContract = new Contract(
    stablecoin.address,
    ERC20_ABI,
    this.signer
  );

  const amountWei = ethers.parseUnits(
    amount.toString(),
    stablecoin.decimals
  );

  console.log("Sending token...");
  console.log("From:", userAddress);
  console.log("To:", receiver);
  console.log("Token:", stablecoin.address);
  console.log("Amount:", amountWei.toString());

  // -----------------------------
  // CHECK BALANCE
  // -----------------------------
  const balance = await tokenContract.balanceOf(userAddress);

  if (BigInt(balance) < BigInt(amountWei)) {
    throw new Error("Insufficient token balance");
  }

  // -----------------------------
  // SEND TRANSFER
  // -----------------------------
  const tx = await tokenContract.transfer(
    receiver,
    amountWei
  );

  console.log("TX sent:", tx.hash);

  const receipt = await tx.wait();

  console.log("TX confirmed:", receipt.hash);

  return receipt.hash;
}


}

export const web3Service = new Web3Service();
export default web3Service;
