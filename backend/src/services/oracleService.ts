import { ethers } from "ethers";
import HotelOracleAbi from "../../../out/HotelOracle.sol/HotelOracle.json";

const ORACLE_ADDRESS  = process.env.HOTEL_ORACLE_ADDRESS!;
const SUBSCRIPTION_ID = process.env.CHAINLINK_SUBSCRIPTION_ID;
const DON_ID_STR      = process.env.CHAINLINK_DON_ID || "fun-base-sepolia-1";
const GAS_LIMIT       = 300_000;

// DON ID must be bytes32 — right-pad the ASCII string
function donIdToBytes32(donId: string): string {
  return ethers.encodeBytes32String(donId);
}

export class OracleService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
    if (!rpc) throw new Error("Missing BASE_SEPOLIA_RPC");
    if (!process.env.PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY");
    if (!ORACLE_ADDRESS) throw new Error("Missing HOTEL_ORACLE_ADDRESS");

    this.provider = new ethers.JsonRpcProvider(rpc);
    this.signer   = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(ORACLE_ADDRESS, HotelOracleAbi.abi, this.signer);
  }

  // =========================================
  //  REQUEST PERFORMANCE DATA (Chainlink)
  // =========================================
  async requestPerformanceUpdate(hotelBlockchainId: number, apiUrl: string) {
    if (!SUBSCRIPTION_ID || SUBSCRIPTION_ID === "") {
      throw new Error(
        "CHAINLINK_SUBSCRIPTION_ID not set. Create one at https://functions.chain.link and add it to .env"
      );
    }

    const tx = await this.contract.requestPerformanceData(
      hotelBlockchainId,
      apiUrl,
      Number(SUBSCRIPTION_ID),
      GAS_LIMIT,
      donIdToBytes32(DON_ID_STR)
    );

    const receipt = await tx.wait();
    return { txHash: receipt.hash, hotelBlockchainId, apiUrl };
  }

  // =========================================
  //  REQUEST HOTEL STATIC DATA (Chainlink)
  // =========================================
  async requestHotelDataUpdate(hotelBlockchainId: number, apiUrl: string) {
    if (!SUBSCRIPTION_ID || SUBSCRIPTION_ID === "") {
      throw new Error(
        "CHAINLINK_SUBSCRIPTION_ID not set. Create one at https://functions.chain.link and add it to .env"
      );
    }

    const tx = await this.contract.requestHotelData(
      hotelBlockchainId,
      apiUrl,
      Number(SUBSCRIPTION_ID),
      GAS_LIMIT,
      donIdToBytes32(DON_ID_STR)
    );

    const receipt = await tx.wait();
    return { txHash: receipt.hash, hotelBlockchainId, apiUrl };
  }

  // =========================================
  //  READ PERFORMANCE DATA (on-chain)
  // =========================================
  async getOnChainPerformance(hotelBlockchainId: number) {
    const [occupancyRate, revenue, revpar, bookingCount, period, lastUpdated] =
      await this.contract.getPerformanceData(hotelBlockchainId);

    return {
      hotelBlockchainId,
      occupancyRate: Number(occupancyRate) / 100,  // reverse the x100 scaling
      revenue:       Number(revenue) / 100,
      revpar:        Number(revpar) / 100,
      bookingCount:  Number(bookingCount),
      period:        period as string,
      lastUpdated:   Number(lastUpdated) > 0
        ? new Date(Number(lastUpdated) * 1000).toISOString()
        : null,
      hasData:       Number(lastUpdated) > 0,
    };
  }

  // =========================================
  //  READ HOTEL STATIC DATA (on-chain)
  // =========================================
  async getOnChainHotelData(hotelBlockchainId: number) {
    const [name, location, imageUrl, rooms, rating, lastUpdated] =
      await this.contract.getHotelData(hotelBlockchainId);

    return {
      hotelBlockchainId,
      name, location, imageUrl,
      rooms:       Number(rooms),
      rating:      Number(rating),
      lastUpdated: Number(lastUpdated) > 0
        ? new Date(Number(lastUpdated) * 1000).toISOString()
        : null,
      hasData:     Number(lastUpdated) > 0,
    };
  }

  isReady(): boolean {
    return !!SUBSCRIPTION_ID && SUBSCRIPTION_ID !== "";
  }
}

export const oracleService = new OracleService();
