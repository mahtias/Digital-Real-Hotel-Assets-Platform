import { ethers } from "ethers";

const DRA_TOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalMinted() external view returns (uint256)",
  "function remainingSupply() external view returns (uint256)",
  "function MAX_SUPPLY() external view returns (uint256)",
];

const DRA_EARN_RATE = Number(process.env.DRA_EARN_RATE ?? 10); // DRA per $1 invested

class DRAService {
  private contract: ethers.Contract | null = null;

  private getContract(): ethers.Contract {
    if (this.contract) return this.contract;

    const address = process.env.DRA_TOKEN_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const rpc = process.env.BASE_RPC_URL || "https://sepolia.base.org";

    if (!address || !privateKey) {
      throw new Error("DRA_TOKEN_ADDRESS or PRIVATE_KEY not configured");
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(address, DRA_TOKEN_ABI, wallet);
    return this.contract;
  }

  /**
   * Mint DRA tokens to an investor wallet.
   * Rate: DRA_EARN_RATE DRA per $1 invested.
   * Fire-and-forget — does not block booking/investment confirmation.
   */
  async mintReward(toAddress: string, usdcAmount: number): Promise<string | null> {
    try {
      const draAmount = BigInt(Math.floor(usdcAmount * DRA_EARN_RATE)) * BigInt(10 ** 18);
      const contract = this.getContract();
      const tx = await contract.mint(toAddress, draAmount);
      const receipt = await tx.wait();
      console.log(`✅ DRA minted: ${usdcAmount * DRA_EARN_RATE} DRA → ${toAddress} (tx: ${receipt.hash})`);
      return receipt.hash as string;
    } catch (err: any) {
      console.error("❌ DRA mint failed:", err.message);
      return null;
    }
  }

  /**
   * Get DRA balance of a wallet address (in human-readable DRA, not wei).
   */
  async getBalance(address: string): Promise<number> {
    try {
      const contract = this.getContract();
      const raw: bigint = await contract.balanceOf(address);
      return Number(raw) / 1e18;
    } catch (err: any) {
      console.error("❌ DRA balanceOf failed:", err.message);
      return 0;
    }
  }

  /**
   * Get total minted and remaining supply stats.
   */
  async getStats(): Promise<{ totalMinted: number; remaining: number; maxSupply: number }> {
    try {
      const contract = this.getContract();
      const [minted, remaining, max] = await Promise.all([
        contract.totalMinted(),
        contract.remainingSupply(),
        contract.MAX_SUPPLY(),
      ]);
      return {
        totalMinted: Number(minted) / 1e18,
        remaining:   Number(remaining) / 1e18,
        maxSupply:   Number(max) / 1e18,
      };
    } catch (err: any) {
      console.error("❌ DRA stats failed:", err.message);
      return { totalMinted: 0, remaining: 100_000_000, maxSupply: 100_000_000 };
    }
  }
}

export const draService = new DRAService();
