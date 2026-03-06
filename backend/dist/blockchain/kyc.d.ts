import { PublicClient, WalletClient, Address } from 'viem';
import KYCService from "../services/KYCService";
export declare class BlockchainKYC {
    private address;
    private public;
    private wallet;
    constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient);
    isVerified(userAddress: string): Promise<boolean>;
    isPending(userAddress: string): Promise<boolean>;
    getVerificationTime(userAddress: string): Promise<bigint>;
    verifyUser(userAddress: string): Promise<string>;
    getKYCRecord(userAddress: string): Promise<unknown>;
    getKYCStatus(userAddress: string): Promise<number>;
}
export default KYCService;
//# sourceMappingURL=kyc.d.ts.map