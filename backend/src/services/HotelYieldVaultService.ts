// backend/services/HotelYieldVaultService.ts

import {
 createPublicClient,
  createWalletClient,
  http,
  getContract,
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { keccak256, stringToHex } from "viem";
import hotelYieldVaultAbi from "../../../out/HotelYieldVault.sol/HotelYieldVault.json";
import { engineService } from "./engineService";

class HotelYieldVaultService {
  private publicClient;
  private walletClient;
  private contract;

  constructor() {
    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );

    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(process.env.RPC_URL),
    });

    this.walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.RPC_URL),
    });

      const vaultAddress = process.env.HOTEL_YIELD_VAULT_ADDRESS as `0x${string}`;
        this.contract = getContract({
        address: vaultAddress,
        abi: hotelYieldVaultAbi.abi,
        client: {
            public: this.publicClient,
            wallet: this.walletClient,
        },
        });
  }

  async getVaultStats() {
  return await this.contract.read.getVaultStats();
}

async getClaimableYield(
  investor: `0x${string}`
) {
  return await this.contract.read.getClaimableYield([
    investor,
  ]);
}

async addClaimable(
  distributionId: string,
  investor: `0x${string}`,
  amount: bigint
) {
  const hash = await this.contract.write.addClaimable([
    keccak256(stringToHex(distributionId)),
    investor,
    amount,
  ]);

  const receipt =
    await this.publicClient.waitForTransactionReceipt({
      hash,
    });

  return {
    hash,
    receipt,
  };
}

async addClaimableBatch(
  distributionIds: string[],
  investors: `0x${string}`[],
  amounts: bigint[]
) {
  const ids = distributionIds.map(id => keccak256(stringToHex(id)));
  const vaultAddress = process.env.HOTEL_YIELD_VAULT_ADDRESS!;

  if (engineService.isEnabled()) {
    console.log(" Using thirdweb Engine for addClaimableBatch");
    const { queueId } = await engineService.addClaimableBatch(
      vaultAddress,
      ids,
      investors,
      amounts
    );
    console.log(" Engine queued yield batch tx:", queueId);
    const result = await engineService.waitForMine(queueId);
    return { hash: result.txHash as `0x${string}`, receipt: { status: "success" } };
  }

  const hash = await this.contract.write.addClaimableBatch([ids, investors, amounts]);
  const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
  return { hash, receipt };
}
async claimYield() {
  const hash =
    await this.contract.write.claimYield();

  const receipt =
    await this.publicClient.waitForTransactionReceipt({
      hash,
    });

  return {
    hash,
    receipt,
  };
}
}

export default new HotelYieldVaultService();