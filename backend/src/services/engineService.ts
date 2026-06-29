import axios, { AxiosInstance } from "axios";

const ENGINE_URL    = process.env.THIRDWEB_ENGINE_URL    || "http://localhost:3005";
const ACCESS_TOKEN  = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN || "";
const ENGINE_WALLET = process.env.THIRDWEB_ENGINE_WALLET_ADDRESS || "";
const CHAIN_ID      = process.env.CHAIN_ID || "84532"; // Base Sepolia

export class EngineService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENGINE_URL,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  isEnabled(): boolean {
    return process.env.USE_THIRDWEB_ENGINE === "true" &&
      !!ACCESS_TOKEN &&
      !!ENGINE_WALLET;
  }

  // =========================================
  //  WRITE — generic contract call
  // =========================================
  async writeContract(
    contractAddress: string,
    functionName: string,
    args: any[],
    gasLimit?: number
  ): Promise<{ queueId: string }> {
    const body: any = {
      functionName,
      args,
      backendWalletAddress: ENGINE_WALLET,
    };

    if (gasLimit) {
      body.txOverrides = { gasLimit: gasLimit.toString() };
    }

    const res = await this.client.post(
      `/contract/${CHAIN_ID}/${contractAddress}/write`,
      body
    );

    return { queueId: res.data.result.queueId };
  }

  // =========================================
  //  APPROVE KYC
  // =========================================
  async approveKYC(
    kycContractAddress: string,
    walletAddress: string,
    level: number,
    expiresAt: number
  ): Promise<{ queueId: string }> {
    return this.writeContract(
      kycContractAddress,
      "approveKYC",
      [walletAddress, level, expiresAt],
      200000
    );
  }

  // =========================================
  //  MINT INVESTMENT TOKENS
  // =========================================
  async mintInvestment(
    tokenContractAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<{ queueId: string }> {
    return this.writeContract(
      tokenContractAddress,
      "mintInvestment",
      [toAddress, amount.toString()],
      500000
    );
  }

  // =========================================
  //  ADD CLAIMABLE BATCH (yield vault)
  // =========================================
  async addClaimableBatch(
    vaultAddress: string,
    distributionIds: string[],
    investors: string[],
    amounts: bigint[]
  ): Promise<{ queueId: string }> {
    return this.writeContract(
      vaultAddress,
      "addClaimableBatch",
      [distributionIds, investors, amounts.map(a => a.toString())],
      500000
    );
  }

  // =========================================
  //  CHECK TRANSACTION STATUS
  // =========================================
  async getTransactionStatus(queueId: string) {
    const res = await this.client.get(`/transaction/status/${queueId}`);
    const tx  = res.data.result;

    return {
      queueId,
      status:  tx.status,        // "queued" | "sent" | "mined" | "errored"
      txHash:  tx.transactionHash ?? null,
      error:   tx.errorMessage   ?? null,
      minedAt: tx.minedAt        ?? null,
    };
  }

  // =========================================
  //  WAIT FOR MINE (poll until mined or error)
  // =========================================
  async waitForMine(
    queueId: string,
    maxAttempts = 30,
    delayMs = 3000
  ): Promise<{ txHash: string }> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getTransactionStatus(queueId);

      if (status.status === "mined" && status.txHash) {
        return { txHash: status.txHash };
      }

      if (status.status === "errored") {
        throw new Error(`Engine transaction failed: ${status.error}`);
      }

      await new Promise(r => setTimeout(r, delayMs));
    }

    throw new Error(`Engine transaction timed out (queueId: ${queueId})`);
  }

  // =========================================
  //  LIST BACKEND WALLETS
  // =========================================
  async listWallets() {
    const res = await this.client.get("/backend-wallet/get-all");
    return res.data.result ?? [];
  }

  // =========================================
  //  HEALTH CHECK
  // =========================================
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get("/health");
      return true;
    } catch {
      return false;
    }
  }
}

export const engineService = new EngineService();
