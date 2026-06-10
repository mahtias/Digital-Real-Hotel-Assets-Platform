export type StablecoinIssuer = "USDC" | "USDT" | "HSBC" | "STANDARD_CHARTERED" | "OTHER";
export type Stablecoin = {
    symbol: string;
    address: string;
    chainId: number;
    decimals: number;
    issuer: StablecoinIssuer;
    isActive: boolean;
    sandboxEnabled: boolean;
    productionEnabled: boolean;
    supportsFreeze: boolean;
    supportsComplianceHooks: boolean;
    complianceTier: "CRYPTO" | "BANK_GRADE";
    allowBookings: boolean;
    allowInvestments: boolean;
    allowSettlements: boolean;
};
export declare const SUPPORTED_CHAINS: {
    ETHEREUM: number;
    BASE_SEPOLIA: number;
};
export declare const STABLECOIN_REGISTRY: Record<string, Stablecoin>;
//# sourceMappingURL=stablecoinRegistry.d.ts.map