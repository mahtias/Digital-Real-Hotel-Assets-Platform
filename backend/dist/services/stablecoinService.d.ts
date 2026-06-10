import { Stablecoin } from "../config/stablecoinRegistry";
export declare class StablecoinService {
    static ACTIVE_CHAIN_ID: number;
    static getStablecoin(token: string): Stablecoin;
    static validateToken(token: string, operation: "BOOKING" | "INVESTMENT" | "SETTLEMENT"): {
        valid: boolean;
        coin: Stablecoin;
    };
    static isComplianceMode(token: string): boolean;
    static isSandboxAllowed(token: string): boolean;
    static isProductionAllowed(token: string): boolean;
    static validateComplianceTransfer(token: string): {
        complianceMode: boolean;
        requiresEnhancedSettlement: boolean;
        freezeSupported: boolean;
        issuer: import("../config/stablecoinRegistry").StablecoinIssuer;
    };
}
//# sourceMappingURL=stablecoinService.d.ts.map