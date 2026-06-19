// src/utils/investmentValidator.ts

import { ethers } from "ethers";

type Stablecoin = {
  address: string;
  symbol: string;
  decimals: number;
  balance: bigint; // user's on-chain balance (from wagmi or web3Service)
};

type Params = {
  walletAddress?: string;
  investmentAmount: number;
  stablecoin: Stablecoin;
  ethBalance?: bigint; // gas balance
  estimatedGasETH?: bigint;
};

export async function validateInvestment({
  walletAddress,
  investmentAmount,
  stablecoin,
  ethBalance = 0n,
  estimatedGasETH = 0n,
}: Params): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    //  1. Wallet check
    if (!walletAddress) {
      return {
        success: false,
        message: "Wallet not connected",
      };
    }

    //  2. Amount check
    if (!investmentAmount || investmentAmount < 1) {
      return {
        success: false,
        message: "Minimum investment is $1",
      };
    }

    //  3. Convert amount to token units
    const amountInWei = ethers.parseUnits(
      investmentAmount.toString(),
      stablecoin.decimals
    );

    // 4. Stablecoin balance check
    if (stablecoin.balance < amountInWei) {
      return {
        success: false,
        message: `Insufficient ${stablecoin.symbol}. Need ${investmentAmount}, available ${(Number(stablecoin.balance) / 10 ** stablecoin.decimals).toFixed(2)}`,
      };
    }

    
    //  5. ETH gas check
    if (ethBalance < estimatedGasETH) {
      return {
        success: false,
        message: "Insufficient ETH for gas fee",
      };
    }

    // ✅ OK
    return {
      success: true,
      message: "OK",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Validation failed",
    };
  }
}