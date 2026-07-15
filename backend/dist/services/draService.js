"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draService = void 0;
const ethers_1 = require("ethers");
const DRA_TOKEN_ABI = [
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address account) external view returns (uint256)",
    "function totalMinted() external view returns (uint256)",
    "function remainingSupply() external view returns (uint256)",
    "function MAX_SUPPLY() external view returns (uint256)",
];
const DRA_EARN_RATE = Number(process.env.DRA_EARN_RATE ?? 10);
class DRAService {
    constructor() {
        this.contract = null;
    }
    getContract() {
        if (this.contract)
            return this.contract;
        const address = process.env.DRA_TOKEN_ADDRESS;
        const privateKey = process.env.PRIVATE_KEY;
        const rpc = process.env.BASE_RPC_URL || "https://sepolia.base.org";
        if (!address || !privateKey) {
            throw new Error("DRA_TOKEN_ADDRESS or PRIVATE_KEY not configured");
        }
        const provider = new ethers_1.ethers.JsonRpcProvider(rpc);
        const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        this.contract = new ethers_1.ethers.Contract(address, DRA_TOKEN_ABI, wallet);
        return this.contract;
    }
    async mintReward(toAddress, usdcAmount) {
        try {
            const draAmount = BigInt(Math.floor(usdcAmount * DRA_EARN_RATE)) * BigInt(10 ** 18);
            const contract = this.getContract();
            const tx = await contract.mint(toAddress, draAmount);
            const receipt = await tx.wait();
            console.log(`✅ DRA minted: ${usdcAmount * DRA_EARN_RATE} DRA → ${toAddress} (tx: ${receipt.hash})`);
            return receipt.hash;
        }
        catch (err) {
            console.error("❌ DRA mint failed:", err.message);
            return null;
        }
    }
    async getBalance(address) {
        try {
            const contract = this.getContract();
            const raw = await contract.balanceOf(address);
            return Number(raw) / 1e18;
        }
        catch (err) {
            console.error("❌ DRA balanceOf failed:", err.message);
            return 0;
        }
    }
    async getStats() {
        try {
            const contract = this.getContract();
            const [minted, remaining, max] = await Promise.all([
                contract.totalMinted(),
                contract.remainingSupply(),
                contract.MAX_SUPPLY(),
            ]);
            return {
                totalMinted: Number(minted) / 1e18,
                remaining: Number(remaining) / 1e18,
                maxSupply: Number(max) / 1e18,
            };
        }
        catch (err) {
            console.error("❌ DRA stats failed:", err.message);
            return { totalMinted: 0, remaining: 100_000_000, maxSupply: 100_000_000 };
        }
    }
}
exports.draService = new DRAService();
//# sourceMappingURL=draService.js.map