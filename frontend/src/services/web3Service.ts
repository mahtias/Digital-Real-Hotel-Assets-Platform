// frontend/services/web3Service.ts
import { BrowserProvider, Contract, ethers, JsonRpcSigner } from "ethers";

const ABI = [
  "function submitKYC(address user, bytes32 documentHash) external returns (uint256)",
  "function updateKYCStatus(uint256 kycId, uint8 status, uint8 level) external",
  "function getKYC(uint256 kycId) external view returns (address, bytes32, uint8, uint8, uint256, uint256)",
  "function isKYCVerified(address user) external view returns (bool)",
  "function getUserKYCLevel(address user) external view returns (uint8)",

  "event KYCSubmitted(uint256 indexed kycId, address indexed user, bytes32 documentHash)",
  "event KYCStatusUpdated(uint256 indexed kycId, uint8 status, uint8 level)"
];

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;
  private contract: Contract | null = null;

  private contractAddress: string = import.meta.env.VITE_KYC_CONTRACT_ADDRESS ?? "";

  constructor() {
    if (this.isMetaMaskInstalled()) {
      this.setupListeners();
    }
  }

  // -------------------
  // BASIC REQUIREMENTS
  // -------------------

  isMetaMaskInstalled(): boolean {
    return (
      typeof window !== "undefined" &&
      window.ethereum?.isMetaMask === true &&
      typeof window.ethereum.request === "function"
    );
  }

  private getEthereumProvider() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed.");
    }
    return window.ethereum;
  }

  private setupListeners() {
    if (!window.ethereum) return;

    window.ethereum.on?.("accountsChanged", () => this.disconnect());
    window.ethereum.on?.("chainChanged", () => window.location.reload());
  }

  async connectWallet(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error("MetaMask not installed.");
    }

    const ethereum = this.getEthereumProvider();
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts"
    })) as string[];

    this.provider = new BrowserProvider(ethereum);
    this.signer = await this.provider.getSigner();

    this.contract = new Contract(this.contractAddress, ABI, this.signer);

    return accounts[0];
  }

  async getCurrentAddress(): Promise<string | null> {
    if (!this.provider) return null;
    const signer = await this.provider.getSigner();
    return signer.getAddress();
  }

  // -------------------
  // KYC SMART CONTRACT
  // -------------------

 async submitKYC(documentHash: string): Promise<bigint> {
  if (!this.contract) throw new Error("Wallet not connected.");

  const user = await this.getCurrentAddress();
  if (!user) throw new Error("No wallet connected.");

  // ethers v6 uses zeroPadValue instead of hexZeroPad
  const padded = documentHash.startsWith("0x")
    ? documentHash
    : "0x" + documentHash;

  const hash32 = ethers.zeroPadValue(padded, 32);

  const tx = await this.contract.submitKYC(user, hash32);
  const receipt = await tx.wait();

  const event = receipt.logs.find((l: any) => l.fragment?.name === "KYCSubmitted");
  return event?.args?.kycId ?? 0n;
}

  async getUserKYCLevel(address: string): Promise<number> {
    if (!this.contract) throw new Error("Contract not initialized.");
    return Number(await this.contract.getUserKYCLevel(address));
  }

  async isKYCVerified(address: string): Promise<boolean> {
    if (!this.contract) throw new Error("Contract not initialized.");
    return await this.contract.isKYCVerified(address);
  }

  async getKYCDetails(kycId: number) {
    if (!this.contract) throw new Error("Contract not initialized.");
    const r = await this.contract.getKYC(kycId);

    return {
      user: r[0],
      documentHash: r[1],
      status: Number(r[2]),
      level: Number(r[3]),
      submittedAt: Number(r[4]),
      updatedAt: Number(r[5])
    };
  }

  // -------------------
  // CLEANUP
  // -------------------

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }
}

export const web3Service = new Web3Service();
export default web3Service;
