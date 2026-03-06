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
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "level", type: "uint8" },
    ],
    name: "setKYCStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
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

//  async setSignerFromExistingWallet() {
//   if (!window.ethereum) throw new Error("Wallet not installed");

//   // Reuse provider if already created
//   if (!this.provider) {
//     this.provider = new BrowserProvider(window.ethereum);
//   }

//   // Get already connected accounts (DO NOT request)
//   const accounts = (await window.ethereum.request({
//     method: "eth_accounts",
//   })) as string[];

//   if (!accounts || accounts.length === 0) {
//     throw new Error("No wallet connected");
//   }

//   const connectedAccount = accounts[0].toLowerCase();

//   // If signer already exists and matches account → reuse it
//   if (this.signer) {
//     const current = (await this.signer.getAddress()).toLowerCase();
//     if (current === connectedAccount) {
//       return connectedAccount;
//     }
//   }

//   // Otherwise create signer bound to the connected account
//   this.signer = await this.provider.getSigner(connectedAccount);

//   // Reinitialize contracts with SAME signer
//   this.kycContract = new Contract(
//     KYC_CONTRACT_ADDRESS,
//     KYC_ABI,
//     this.signer
//   );

//   return connectedAccount;
// }
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

  /** Only call this if user hasn’t connected yet */
  // async connectWallet(): Promise<string> {
  //   if (!this.isMetaMaskInstalled()) throw new Error("MetaMask not installed.");
  //   const ethereum = this.getEthereumProvider();
  //   const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];

  //   this.provider = new BrowserProvider(ethereum);
  //   this.signer = await this.provider.getSigner();

  //   this.kycContract = new Contract(KYC_CONTRACT_ADDRESS, KYC_ABI, this.signer);

  //   return accounts[0];
  // }

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

  async submitKYC(documentHash: string): Promise<bigint> {
    if (!this.kycContract || !this.signer) throw new Error("Wallet not connected.");

    const user = await this.getCurrentAddress();
    if (!user) throw new Error("No wallet connected.");

    const padded = documentHash.startsWith("0x") ? documentHash : "0x" + documentHash;
    const hash32 = ethers.zeroPadValue(padded, 32);

    const tx = await this.kycContract.submitKYC(user, hash32);
    const receipt = await tx.wait();

    const event = receipt.logs.find((l: any) => l.fragment?.name === "KYCSubmitted");
    return event?.args?.kycId ?? 0n;
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
 async investOnBlockchain(blockchainId: number, dbHotelId: string, usdcAmount: number) {
    if (!this.signer) throw new Error("Wallet not connected.");

    const hotelContract = new Contract(
      HOTEL_INVESTMENT_ADDRESS!,
      HotelInvestmentABI,
      this.signer
    );

    // Convert USDC amount to 6 decimals
    const usdcAmountWei = ethers.parseUnits(usdcAmount.toString(), 6);

    // Send transaction
    const tx = await hotelContract.invest(blockchainId, usdcAmountWei, { gasLimit: 500_000 });
    console.log("Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);

    // ✅ Update backend via apiClient (token handled automatically)
    await apiClient.post("/investments/confirm", {
      hotelId: dbHotelId,            // DB UUID string
      amount: usdcAmount,
      blockchainTxHash: receipt.hash // always `hash` from ethers v6
    });
globalEvent.emit('investmentAdded', { hotelId: dbHotelId, amount: usdcAmount });
    return receipt;
  
}
}

export const web3Service = new Web3Service();
export default web3Service;
