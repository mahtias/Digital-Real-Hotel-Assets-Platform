import { PublicClient, WalletClient, Address, Hash } from 'viem';
import kycRegistryAbi from './abis/KYCRegistry.json';
import KYCService from "../services/KYCService";

export class BlockchainKYC  {
  private address: Address;
  private public: PublicClient;
  private wallet: WalletClient;

  constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient) {
    this.address = address;
    this.public = publicClient;
    this.wallet = walletClient;
  }

  // ✅ Fixed: Use isKYCVerified instead of isVerified
  async isVerified(userAddress: string): Promise<boolean> {
    try {
      const address = userAddress.toLowerCase() as Address;

      const result = await this.public.readContract({
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'isKYCVerified',
        args: [address],
      });

      return result as boolean;
    } catch (error) {
      console.error(' Error checking KYC verification:', error);
      throw error;
    }
  }

  // ✅ Fixed: Use getKYCStatus to check if PENDING (status = 1)
  async isPending(userAddress: string): Promise<boolean> {
    try {
      const address = userAddress.toLowerCase() as Address;

      const status = await this.public.readContract({
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'getKYCStatus',
        args: [address],
      });

      // KYCStatus: NONE=0, PENDING=1, APPROVED=2, REJECTED=3, REVOKED=4
      return status === 1;
    } catch (error) {
      console.error(' Error checking pending status:', error);
      throw error;
    }
  }

  // ✅ Fixed: Use getKYCRecord to get approvedAt timestamp
  async getVerificationTime(userAddress: string): Promise<bigint> {
    try {
      const address = userAddress.toLowerCase() as Address;

      const record = await this.public.readContract({
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'getKYCRecord',
        args: [address],
      }) as any;

      return record.approvedAt;
    } catch (error) {
      console.error(' Error getting verification time:', error);
      throw error;
    }
  }

  // ✅ Fixed: Use approveKYC with proper parameters
  async verifyUser(userAddress: string): Promise<string> {
    try {
      console.log(' Approving KYC on blockchain:', userAddress);

      // Validate address format
      if (!userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error(`Invalid wallet address format: ${userAddress}`);
      }

      const address = userAddress.toLowerCase() as Address;
      const [account] = await this.wallet.getAddresses();

      // Parameters for approveKYC(address _user, KYCLevel _level, uint256 _expiresAt, bytes32 _documentHash)
      const kycLevel = 1; // BASIC = 1
      const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
      const documentHash = '0x0000000000000000000000000000000000000000000000000000000000000000' as Hash; // Placeholder

      const hash = await this.wallet.writeContract({
        account,
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'approveKYC',
        args: [address, kycLevel, expiresAt, documentHash],
        chain: this.wallet.chain,
      });

      console.log(' KYC approval transaction sent:', hash);

      // Wait for confirmation
      const receipt = await this.public.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        console.log(' KYC approved successfully:', receipt.transactionHash);
        return receipt.transactionHash;
      } else {
        throw new Error('KYC approval transaction failed');
      }
    } catch (error: any) {
      console.error(' Error approving KYC:', error);
      throw new Error(`Failed to approve KYC: ${error.message}`);
    }
  }

  // ✅ New: Get full KYC record
  async getKYCRecord(userAddress: string) {
    try {
      const address = userAddress.toLowerCase() as Address;

      const record = await this.public.readContract({
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'getKYCRecord',
        args: [address],
      });

      return record;
    } catch (error) {
      console.error(' Error getting KYC record:', error);
      throw error;
    }
  }

  // ✅ New: Get KYC status
  async getKYCStatus(userAddress: string): Promise<number> {
    try {
      const address = userAddress.toLowerCase() as Address;

      const status = await this.public.readContract({
        address: this.address,
        abi: kycRegistryAbi,
        functionName: 'getKYCStatus',
        args: [address],
      });

      return status as number;
    } catch (error) {
      console.error(' Error getting KYC status:', error);
      throw error;
    }
  }
}

// Default export for backward compatibility
export default KYCService;
