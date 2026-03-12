// frontend/services/web3Service.ts
import { BrowserProvider, Contract, ethers, JsonRpcSigner, Signer } from "ethers";
import HotelInvestmentJSON from "../contracts/ABI/HotelInvestment.json";
//import axios from "axios";
import apiClient from "@/api/apiClient";
import { globalEvent } from '@/utils/events';
//const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 

const HotelInvestmentABI = HotelInvestmentJSON.abi;

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
  "function decimals() view returns (uint8)"
];

const HOTEL_INVESTMENT_ADDRESS =
  import.meta.env.VITE_HOTEL_INVESTMENT_CONTRACT_ADDRESS ?? "";
const KYC_CONTRACT_ADDRESS = import.meta.env.VITE_KYC_CONTRACT_ADDRESS ?? "";

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | Signer | null = null;
  private kycContract: Contract | null = null;

  constructor() {
    if (this.isMetaMaskInstalled()) this.setupListeners();
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
  // HOTEL INVESTMENT
  // -------------------
async investOnBlockchain(
  blockchainId: number,
  dbHotelId: string,
  usdcAmount: number
) {
  if (!this.signer) throw new Error("Wallet not connected.");

  const userAddress = await this.signer.getAddress();

  const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

  if (!USDC_ADDRESS) {
    throw new Error("USDC address not configured");
  }

  const hotelContract = new Contract(
    HOTEL_INVESTMENT_ADDRESS,
    HotelInvestmentABI,
    this.signer
  );

  const usdcContract = new Contract(
    USDC_ADDRESS,
    ERC20_ABI,
    this.signer
  );

  // Convert to 6 decimals
  const usdcAmountWei = ethers.parseUnits(usdcAmount.toString(), 6);

  console.log("User:", userAddress);
  console.log("Amount:", usdcAmountWei.toString());

  // -----------------------------
  // 1️ CHECK BALANCE
  // -----------------------------
  const balance = await usdcContract.balanceOf(userAddress);

  if (balance < usdcAmountWei) {
    throw new Error("Insufficient USDC balance");
  }

  // -----------------------------
  // 2️ CHECK ALLOWANCE
  // -----------------------------
  const allowance = await usdcContract.allowance(
    userAddress,
    HOTEL_INVESTMENT_ADDRESS
  );

  console.log("Current allowance:", allowance.toString());

  // -----------------------------
  // 3️ APPROVE IF NEEDED
  // -----------------------------
  if (allowance < usdcAmountWei) {
    console.log("Approving USDC...");

    const approveTx = await usdcContract.approve(
      HOTEL_INVESTMENT_ADDRESS,
      usdcAmountWei
    );

    console.log("Approve tx:", approveTx.hash);

    await approveTx.wait();

    console.log("USDC approved");
  }

  // -----------------------------
  // 4️ INVEST
  // -----------------------------
  console.log("Sending invest transaction...");

  const tx = await hotelContract.invest(
    blockchainId,
    usdcAmountWei
  );

  console.log("Invest tx:", tx.hash);

  const receipt = await tx.wait();

  console.log("Investment confirmed:", receipt.hash);

  // -----------------------------
  // 5️ BACKEND CONFIRMATION
  // -----------------------------
  await apiClient.post("/investments/confirm", {
    hotelId: dbHotelId,
    amount: usdcAmount,
    blockchainTxHash: receipt.hash
  });

  // -----------------------------
  // 6️ FRONTEND EVENT
  // -----------------------------
  globalEvent.emit("investmentAdded", {
    hotelId: dbHotelId,
    amount: usdcAmount
  });

  return receipt;
}
}

export const web3Service = new Web3Service();
export default web3Service;
