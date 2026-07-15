declare class HotelYieldVaultService {
    private publicClient;
    private walletClient;
    private contract;
    constructor();
    getVaultStats(): Promise<unknown>;
    getClaimableYield(investor: `0x${string}`): Promise<unknown>;
    addClaimable(distributionId: string, investor: `0x${string}`, amount: bigint): Promise<{
        hash: `0x${string}`;
        receipt: {
            blobGasPrice?: bigint | undefined;
            blobGasUsed?: bigint | undefined;
            blockHash: import("viem").Hash;
            blockNumber: bigint;
            blockTimestamp?: bigint | undefined;
            contractAddress: import("viem").Address | null | undefined;
            cumulativeGasUsed: bigint;
            effectiveGasPrice: bigint;
            from: import("viem").Address;
            gasUsed: bigint;
            logs: import("viem").Log<bigint, number, false>[];
            logsBloom: import("viem").Hex;
            root?: `0x${string}` | undefined;
            status: "success" | "reverted";
            to: import("viem").Address | null;
            transactionHash: import("viem").Hash;
            transactionIndex: number;
            type: import("viem").TransactionType;
            depositNonce?: bigint | undefined | undefined;
            depositReceiptVersion?: number | undefined | undefined;
            l1GasPrice: bigint | null;
            l1GasUsed: bigint | null;
            l1Fee: bigint | null;
            l1FeeScalar: number | null;
        };
    }>;
    addClaimableBatch(distributionIds: string[], investors: `0x${string}`[], amounts: bigint[]): Promise<{
        hash: `0x${string}`;
        receipt: {
            status: string;
        };
    } | {
        hash: `0x${string}`;
        receipt: {
            blobGasPrice?: bigint | undefined;
            blobGasUsed?: bigint | undefined;
            blockHash: import("viem").Hash;
            blockNumber: bigint;
            blockTimestamp?: bigint | undefined;
            contractAddress: import("viem").Address | null | undefined;
            cumulativeGasUsed: bigint;
            effectiveGasPrice: bigint;
            from: import("viem").Address;
            gasUsed: bigint;
            logs: import("viem").Log<bigint, number, false>[];
            logsBloom: import("viem").Hex;
            root?: `0x${string}` | undefined;
            status: "success" | "reverted";
            to: import("viem").Address | null;
            transactionHash: import("viem").Hash;
            transactionIndex: number;
            type: import("viem").TransactionType;
            depositNonce?: bigint | undefined | undefined;
            depositReceiptVersion?: number | undefined | undefined;
            l1GasPrice: bigint | null;
            l1GasUsed: bigint | null;
            l1Fee: bigint | null;
            l1FeeScalar: number | null;
        };
    }>;
    claimYield(): Promise<{
        hash: `0x${string}`;
        receipt: {
            blobGasPrice?: bigint | undefined;
            blobGasUsed?: bigint | undefined;
            blockHash: import("viem").Hash;
            blockNumber: bigint;
            blockTimestamp?: bigint | undefined;
            contractAddress: import("viem").Address | null | undefined;
            cumulativeGasUsed: bigint;
            effectiveGasPrice: bigint;
            from: import("viem").Address;
            gasUsed: bigint;
            logs: import("viem").Log<bigint, number, false>[];
            logsBloom: import("viem").Hex;
            root?: `0x${string}` | undefined;
            status: "success" | "reverted";
            to: import("viem").Address | null;
            transactionHash: import("viem").Hash;
            transactionIndex: number;
            type: import("viem").TransactionType;
            depositNonce?: bigint | undefined | undefined;
            depositReceiptVersion?: number | undefined | undefined;
            l1GasPrice: bigint | null;
            l1GasUsed: bigint | null;
            l1Fee: bigint | null;
            l1FeeScalar: number | null;
        };
    }>;
}
declare const _default: HotelYieldVaultService;
export default _default;
//# sourceMappingURL=HotelYieldVaultService.d.ts.map