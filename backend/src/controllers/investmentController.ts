// src/controllers/investmentController.ts

import { Request, Response } from "express";
import prisma from "../config/database";
import { web3Service } from "../services/web3Service";
import { KycStatus } from "@prisma/client";
import  kyc  from "../blockchain/kyc";
import { Prisma } from "@prisma/client";
import { verifyTransaction } from "../utils/blockchain";
// ✅ Extend Request to include wallet address from middleware
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role: string;
    walletAddress?: string | null;
  };
  walletAddress?: string; // Added by requireKYC middleware
}

// ✅ Helper: Safe Decimal to Number conversion
const toNumber = (value: Prisma.Decimal | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  return Number(value.toString());
};

// ✅ Helper: Sum array of Decimals
const sumDecimals = (values: (Prisma.Decimal | number | null | undefined)[]): number => {
  return values.reduce((sum: number, val) => sum + toNumber(val), 0);
};

// CREATE INVESTMENT
export const createInvestment = async (req: AuthRequest, res: Response) => {
  console.log("🔥 CREATE INVESTMENT FUNCTION HIT");
  try {
    const { hotelId, amount } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔥 BACKEND RECEIVED REQUEST");
console.log("hotelId:", hotelId);
console.log("amount:", amount);
console.log("type:", typeof amount);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const userId = req.user.userId;

    // ✅ 1. VALIDATION
    if (!hotelId || !amount) {
      return res.status(400).json({ 
        message: 'Hotel ID and amount are required' 
      });
    }

    if (amount < 100) {
      return res.status(400).json({ 
        message: 'Minimum investment is $100' 
      });
    }

    // ✅ 2. GET USER WITH KYC & WALLET
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { kyc: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ 3. CHECK WALLET ADDRESS
    if (!user.walletAddress) {
      return res.status(403).json({ 
        message: 'Please connect and verify your wallet first',
        action: 'CONNECT_WALLET'
      });
    }

    const walletAddress = user.walletAddress;

    //  4. CHECK KYC STATUS (Database)
    if (!user.kyc || user.kyc.status !== KycStatus.APPROVED) {
      return res.status(403).json({ 
        message: 'KYC approval required to invest',
        kycStatus: user.kyc?.status || 'NOT_SUBMITTED',
        action: 'COMPLETE_KYC'
      });
    }

    //  5. CHECK KYC STATUS (Blockchain) - FIXED!
    try {
      const isVerified = await kyc.isVerified(user.walletAddress);

      console.log('🔍 Blockchain KYC verification:', {
        wallet: walletAddress,
        verified: isVerified
      });

      if (!isVerified) {
        return res.status(403).json({ 
          message: 'KYC not verified on blockchain. Please contact support.',
          action: 'SYNC_KYC'
        });
      }
    } catch (error) {
      console.error('❌ Blockchain KYC check failed:', error);
      return res.status(500).json({ 
        message: 'Failed to verify KYC status on blockchain',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // ✅ 6. HOTEL ASSET CHECK
    const hotelAsset = await prisma.hotelAsset.findUnique({
      where: { id: hotelId },
      select: { 
        id: true,
        name: true,
        tokenPrice: true,
        totalTokens: true,
        tokensSold: true,
        status: true,
        tokenSymbol: true,
        tokenId: true,
      }
    });

    if (!hotelAsset) {
      return res.status(404).json({ message: 'Hotel asset not found' });
    }

    if (hotelAsset.status !== 'ACTIVE') {
      return res.status(400).json({ 
        message: 'This hotel is not available for investment' 
      });
    }

    if (!hotelAsset.tokenPrice) {
      return res.status(500).json({ 
        message: 'Token price not set for this hotel' 
      });
    }

    // ✅ 7. CALCULATE TOKENS
    //const tokenAmount = amount / hotelAsset.tokenPrice;
  const tokenPrice = Number(hotelAsset.tokenPrice);
const totalTokens = hotelAsset.totalTokens ? Number(hotelAsset.totalTokens) : 0;
const tokensSold = hotelAsset.tokensSold ? Number(hotelAsset.tokensSold) : 0;

const rawTokenAmount = amount / tokenPrice;
const tokenAmount = Number(rawTokenAmount.toFixed(6));

const newTokensSold = tokensSold + tokenAmount;

if (totalTokens && newTokensSold > totalTokens) {
  return res.status(400).json({
    message: "Not enough tokens available",
    available: totalTokens - tokensSold,
    requested: tokenAmount
  });
}

    // ✅ 8. CREATE INVESTMENT RECORD
    const investment = await prisma.investment.create({
      data: {
        userId,
        hotelAssetId: hotelId,
        amount,
        tokenAmount,
        walletAddress,
        status: 'PENDING',
        blockchainStatus: 'AWAITING_USER_TX',
        investedAmount: amount,
        earnedRewards: 0,
        pendingRewards: 0,
        stakedAmount: 0,
      }
    });

    //  UPDATE HOTEL TOKENS SOLD
    // await prisma.hotelAsset.update({
    //   where: { id: hotelId },
    //   data: { tokensSold: newTokensSold }
    // });

    // //  WEB3 MINT (BACKGROUND)
    // (async () => {
    //   try {
    //     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    //     console.log(' MINTING TOKENS ON BLOCKCHAIN');
    //     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    //     console.log('Investment ID:', investment.id);
    //     console.log('Hotel Asset:', hotelAsset.name);
    //     console.log('Token ID:', hotelAsset.tokenId);
    //     console.log('Recipient:', walletAddress);
    //     console.log('Amount:', tokenAmount);

    //     const txHash = await web3Service.processInvestment(
          
    //     hotelId,
    //     walletAddress,
    //     amount.toString()
    //   );
        
    //     await prisma.investment.update({
    //       where: { id: investment.id },
    //       data: { 
    //         blockchainTxHash: txHash,
    //         blockchainStatus: "MINTED",
    //         status: "CONFIRMED"
    //       }
    //     });

    //     console.log(' Investment minted! TX:', txHash);
    //     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    //   } catch (error: any) {
    //     console.error(' Minting failed:', error);

    //     await prisma.investment.update({
    //       where: { id: investment.id },
    //       data: { 
    //         blockchainStatus: "MINT_FAILED",
    //         status: "FAILED",
    //         blockchainError: error.message
    //       }
    //     });
    //   }
    // })();

    //  RETURN SUCCESS
    return res.status(201).json({
  message: "Investment created. Please confirm the transaction in your wallet.",
  investment: {
    id: investment.id,
    amount,
    tokenAmount,
    status: "PENDING",
    blockchainStatus: "AWAITING_USER_TX",
    hotelAsset: {
      name: hotelAsset.name,
      tokenSymbol: hotelAsset.tokenSymbol,
    }
  }
});

  } catch (error: any) {
    console.error(' Investment creation error:', error);
    return res.status(500).json({ 
      message: 'Failed to create investment', 
      error: error.message 
    });
  }
};

// confirm //////////////

export const confirmInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { hotelId, amount, blockchainTxHash } = req.body;

    if (!hotelId || !amount || !blockchainTxHash) {
      return res.status(400).json({
        error: "hotelId, amount and blockchainTxHash are required",
      });
    }

    const txReceipt = await verifyTransaction(blockchainTxHash);

    const existing = await prisma.investment.findFirst({
      where: { blockchainTxHash },
    });

    if (existing) {
      return res.status(400).json({
        error: "Transaction already used",
      });
    }

    const hotelAsset = await prisma.hotelAsset.findUnique({
      where: { id: hotelId },
    });

    if (!hotelAsset) {
      return res.status(404).json({
        error: "Hotel not found",
      });
    }

    const tokenPrice = Number(hotelAsset.tokenPrice);
    const investmentAmount = Number(amount);

    const tokenAmount = Number((investmentAmount / tokenPrice).toFixed(6));

    const newTokensSold =
      Number(hotelAsset.tokensSold || 0) + tokenAmount;

    if (hotelAsset.totalTokens && newTokensSold > Number(hotelAsset.totalTokens)) {
      return res.status(400).json({
        message: "Not enough tokens available",
      });
    }

    const [investment] = await prisma.$transaction([
      prisma.investment.create({
        data: {
          userId,
          
          hotelAssetId: hotelId,
          amount: investmentAmount,
          investedAmount: investmentAmount,
          tokenAmount,
          
          pendingRewards: 0,
          earnedRewards: 0,
          stakedAmount: 0,
         
          blockchainTxHash,
          status: "ACTIVE",
          blockchainStatus: "MINTED",
        },
      }),

      prisma.hotelAsset.update({
        where: { id: hotelId },
        data: {
          tokensSold: newTokensSold,
        },
      }),
    ]);

    return res.json({
      success: true,
      investment,
    });

  } catch (error) {
    console.error("confirmInvestment error:", error);

    return res.status(500).json({
      error: "Failed to confirm investment",
    });
  }
};


//  GET USER INVESTMENTS (with statistics)
export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const investments = await prisma.investment.findMany({
      where: { 
        userId,
        NOT: { blockchainStatus: "DELETED" }  
      },
      include: { 
        hotelAsset: {
          select: {
            id: true,
            name: true,
            tokenPrice: true,
            tokenSymbol: true,
            imageUrl: true,
            location: true,
            status: true,
            apy: true, // ✅ Include APY for calculations
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    //  Calculate portfolio statistics
    const stats = {
     totalInvested: investments.reduce((sum, inv) => sum + Number(inv.amount), 0),
      totalTokens: investments.reduce((sum, inv) => sum + Number(inv.tokenAmount), 0),
      totalEarned: investments.reduce((sum, inv) => sum + Number(inv.earnedRewards || 0), 0),
      totalPending: investments.reduce((sum, inv) => sum + Number(inv.pendingRewards || 0), 0),
      activeInvestments: investments.filter(inv => inv.status === 'CONFIRMED').length,
      pendingInvestments: investments.filter(inv => inv.status === 'PENDING').length,
      failedInvestments: investments.filter(inv => inv.status === 'FAILED').length,
    };

    //  Group by blockchain status
    const byStatus = {
      minted: investments.filter(inv => inv.blockchainStatus === 'MINTED').length,
      pending: investments.filter(inv => inv.blockchainStatus === 'PENDING').length,
      failed: investments.filter(inv => inv.blockchainStatus === 'MINT_FAILED').length,
    };

    res.json({ 
      success: true, 
      data: investments,
      count: investments.length,
      stats,
      blockchainStatus: byStatus
    });

  } catch (error: any) {
    console.error('❌ Get investments error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getInvestmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const investment = await prisma.investment.findFirst({
      where: { 
        id, 
        userId,
        NOT: { blockchainStatus: "DELETED" }
      },
      include: { 
        hotelAsset: {
          select: {
            id: true,
            name: true,
            tokenPrice: true,
            tokenSymbol: true,
            imageUrl: true,
            location: true,
            apy: true,
            status: true,
            tokenId: true,
            totalTokens: true,
            tokensSold: true,
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            walletAddress: true,
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ 
        success: false, 
        error: "Investment not found" 
      });
    }

    // ✅ FIX: Convert all Decimals to numbers
    const amount = toNumber(investment.amount);
    const tokenAmount = toNumber(investment.tokenAmount);
    const earnedRewards = toNumber(investment.earnedRewards);
    const tokenPrice = toNumber(investment.hotelAsset.tokenPrice);
    const apy = toNumber(investment.hotelAsset.apy);

    // ✅ Calculate metrics with safe numbers
    const currentValue = tokenAmount * tokenPrice;
    const profitLoss = earnedRewards - amount;
    const profitLossPercentage = amount > 0 ? (earnedRewards / amount) * 100 : 0;
    const daysInvested = Math.floor(
      (Date.now() - investment.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const estimatedAnnualReturn = amount * (apy / 100);

    res.json({ 
      success: true, 
      data: {
        ...investment,
        metrics: {
          currentValue,
          profitLoss,
          profitLossPercentage: profitLossPercentage.toFixed(2),
          daysInvested,
          estimatedAnnualReturn
        },
        blockchainConfirmed: investment.blockchainStatus === 'MINTED'
      }
    });

  } catch (error: any) {
    console.error('❌ Get investment error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getInvestmentStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const investments = await prisma.investment.findMany({
      where: { 
        userId,
        NOT: { blockchainStatus: "DELETED" }  
      },
      include: {
        hotelAsset: {
          select: {
            apy: true,
            tokenPrice: true,
            name: true,
          }
        }
      }
    });

    // ✅ Portfolio overview (Fixed Decimal conversions)
    const totalInvested = investments.reduce((sum, inv) => sum + toNumber(inv.amount), 0);
    const totalEarned = investments.reduce((sum, inv) => sum + toNumber(inv.earnedRewards), 0);
    const totalPending = investments.reduce((sum, inv) => sum + toNumber(inv.pendingRewards), 0);
    const totalValue = investments.reduce((sum, inv) => 
      sum + (toNumber(inv.tokenAmount) * toNumber(inv.hotelAsset.tokenPrice)), 0
    );

    // ✅ Performance metrics
    const totalReturn = totalEarned + totalPending;
    const roi = totalInvested > 0 ? ((totalReturn / totalInvested) * 100) : 0;

    // ✅ Asset distribution (Fixed)
    const assetDistribution = investments.reduce((acc: any, inv) => {
      const assetName = inv.hotelAsset.name;
      if (!acc[assetName]) {
        acc[assetName] = { count: 0, totalAmount: 0, totalTokens: 0 };
      }
      acc[assetName].count++;
      acc[assetName].totalAmount += toNumber(inv.amount);
      acc[assetName].totalTokens += toNumber(inv.tokenAmount);
      return acc;
    }, {});

    // ✅ Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInvestments = investments.filter(
      inv => new Date(inv.createdAt) >= thirtyDaysAgo
    );

    res.json({
      success: true,
      data: {
        portfolio: {
          totalInvested,
          totalEarned,
          totalPending,
          totalValue,
          totalReturn,
          roi: roi.toFixed(2),
        },
        counts: {
          total: investments.length,
          active: investments.filter(inv => inv.status === 'CONFIRMED').length,
          pending: investments.filter(inv => inv.status === 'PENDING').length,
          failed: investments.filter(inv => inv.status === 'FAILED').length,
        },
        assetDistribution,
        recentActivity: {
          last30Days: recentInvestments.length,
          recentAmount: recentInvestments.reduce((sum, inv) => sum + toNumber(inv.amount), 0),
        }
      }
    });

  } catch (error: any) {
    console.error(' Get stats error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// ✅ GET INVESTMENTS BY STATUS
export const getInvestmentsByStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status } = req.query; // PENDING, CONFIRMED, FAILED

    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const whereClause: any = {
      userId,
      NOT: { blockchainStatus: "DELETED" }
    };

    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase();
    }

    const investments = await prisma.investment.findMany({
      where: whereClause,
      include: { 
        hotelAsset: {
          select: {
            id: true,
            name: true,
            tokenSymbol: true,
            imageUrl: true,
            tokenPrice: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ 
      success: true, 
      data: investments,
      count: investments.length,
      filter: status || 'all'
    });

  } catch (error: any) {
    console.error(' Get investments by status error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};




// UPDATE INVESTMENT (SECURED & IMPROVED)
export const updateInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { amount } = req.body; 

    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    // ✅ Get user to verify wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true }
    });

    if (!user?.walletAddress) {
      return res.status(403).json({ 
        success: false, 
        error: "Wallet not connected. Please connect your wallet first.",
        action: 'CONNECT_WALLET'
      });
    }

    // ✅ Find investment with all details
    const investment = await prisma.investment.findFirst({
      where: { 
        id, 
        userId,
        NOT: { blockchainStatus: "DELETED" }
      },
      include: { 
        hotelAsset: {
          select: {
            id: true,
            name: true,
            tokenPrice: true,
            tokenSymbol: true,
            totalTokens: true,
            tokensSold: true,
            status: true
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ 
        success: false, 
        error: "Investment not found" 
      });
    }

    // ✅ Check blockchain status (handle null)
    const blockchainStatus = investment.blockchainStatus || 'PENDING';

    if (blockchainStatus === "MINTED") {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot update minted investment. Tokens are already on blockchain.",
        blockchainTxHash: investment.blockchainTxHash
      });
    }

    // ✅ Only allow updates to PENDING or FAILED investments
    if (!['PENDING', 'MINT_FAILED'].includes(blockchainStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot update investment with status: ${blockchainStatus}` 
      });
    }

    // ✅ Validate new amount
    const newAmount = Number(amount);

    if (!amount || isNaN(newAmount) || newAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid amount is required" 
      });
    }

    if (newAmount < 100) {
      return res.status(400).json({ 
        success: false, 
        error: "Minimum investment is $100" 
      });
    }

    // ✅ Check if hotel is still available
    if (investment.hotelAsset.status !== 'ACTIVE') {
      return res.status(400).json({ 
        success: false, 
        error: "This hotel is no longer available for investment" 
      });
    }

    // ✅ Calculate new token amount
    const tokenPrice = toNumber(investment.hotelAsset.tokenPrice);
    if (tokenPrice <= 0) {
      return res.status(500).json({ 
        success: false, 
        error: "Token price not set" 
      });
    }

    const newTokenAmount = newAmount / tokenPrice;

    //  Check token availability (accounting for current investment)
    const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
    const currentInvestmentTokens = toNumber(investment.tokenAmount);
    const totalTokens = toNumber(investment.hotelAsset.totalTokens);

    const availableTokens = totalTokens - (currentTokensSold - currentInvestmentTokens);

    if (newTokenAmount > availableTokens) {
      return res.status(400).json({ 
        success: false, 
        error: `Not enough tokens available. Only ${availableTokens.toFixed(2)} tokens remaining.`,
        available: availableTokens,
        requested: newTokenAmount
      });
    }

    //  Update investment and hotel tokens in a transaction
    const updatedInvestment = await prisma.$transaction(async (tx) => {
      const tokenDifference = newTokenAmount - currentInvestmentTokens;

      await tx.hotelAsset.update({
        where: { id: investment.hotelAssetId },
        data: { tokensSold: currentTokensSold + tokenDifference }
      });

      return tx.investment.update({
        where: { id: investment.id },
        data: {
          amount: newAmount,
          investedAmount: newAmount,
          tokenAmount: newTokenAmount,
          walletAddress: user.walletAddress,
          updatedAt: new Date()
        },
        include: { 
          hotelAsset: {
            select: {
              id: true,
              name: true,
              tokenPrice: true,
              tokenSymbol: true,
              imageUrl: true,
              location: true
            }
          }
        }
      });
    });

    res.json({ 
      success: true, 
      data: updatedInvestment,
      message: `Investment updated to $${newAmount} (${newTokenAmount.toFixed(2)} ${investment.hotelAsset.tokenSymbol || 'tokens'})`
    });

  } catch (error: any) {
    console.error(' Update investment error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update investment",
      details: error.message
    });
  }
};


//  DELETE INVESTMENT (SOFT DELETE WITH VALIDATION)
export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: "Not authenticated" 
      });
    }

    // ✅ Find investment with hotel details
    const investment = await prisma.investment.findFirst({
      where: { 
        id, 
        userId,
        NOT: { blockchainStatus: "DELETED" }
      },
      include: {
        hotelAsset: {
          select: {
            name: true,
            tokenSymbol: true,
            tokensSold: true
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ 
        success: false, 
        error: "Investment not found" 
      });
    }

    //  Check blockchain status (handle null)
    const blockchainStatus = investment.blockchainStatus || 'PENDING';

    //  Don't allow deletion of minted investments
    if (blockchainStatus === "MINTED") {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete minted investment. Tokens are already on blockchain.",
        info: "Please contact support if you need to transfer or sell your tokens.",
        blockchainTxHash: investment.blockchainTxHash
      });
    }

    //  Only allow deletion of PENDING or FAILED investments
    if (!['PENDING', 'MINT_FAILED'].includes(blockchainStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete investment with status: ${blockchainStatus}` 
      });
    }

    //  Soft delete and update hotel tokens in a transaction
    await prisma.$transaction(async (tx) => {
      // Return tokens to available pool
      const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
      const investmentTokens = toNumber(investment.tokenAmount);

      await tx.hotelAsset.update({
        where: { id: investment.hotelAssetId },
        data: { 
          tokensSold: Math.max(0, currentTokensSold - investmentTokens)
        }
      });

      // Soft delete investment
      await tx.investment.update({
        where: { id },
        data: { 
          blockchainStatus: "DELETED",
          status: "CANCELLED",
          updatedAt: new Date()
        }
      });
    });

    res.json({ 
      success: true, 
      message: `Investment of ${toNumber(investment.tokenAmount)} ${investment.hotelAsset.tokenSymbol || 'tokens'} deleted successfully`,
      data: {
        deletedAmount: toNumber(investment.amount),
        deletedTokens: toNumber(investment.tokenAmount),
        hotelName: investment.hotelAsset.name
      }
    });

  } catch (error: any) {
    console.error(' Delete investment error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete investment",
      details: error.message
    });
  }
};


//  CANCEL PENDING INVESTMENT (Alternative to delete)
export const cancelInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { reason } = req.body; // Optional cancellation reason

    if (!userId) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const investment = await prisma.investment.findFirst({
      where: { 
        id, 
        userId, 
        status: 'PENDING' 
      },
      include: { 
        hotelAsset: {
          select: {
            id: true,
            name: true,
            tokenSymbol: true,
            tokensSold: true
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ 
        success: false, 
        error: "Pending investment not found" 
      });
    }

    // ✅ Convert Decimals to numbers before arithmetic
    const currentTokensSold = toNumber(investment.hotelAsset.tokensSold);
    const investmentTokens = toNumber(investment.tokenAmount);
    const investmentAmount = toNumber(investment.amount);

    // ✅ Cancel and refund tokens
    await prisma.$transaction(async (tx) => {
      await tx.hotelAsset.update({
        where: { id: investment.hotelAssetId },
        data: { 
          tokensSold: Math.max(0, currentTokensSold - investmentTokens)
        }
      });

      await tx.investment.update({
        where: { id },
        data: { 
          status: "CANCELLED",
          blockchainStatus: "CANCELLED",
          updatedAt: new Date()
        }
      });

      // ✅ Optional: Log cancellation (if you have activityLog model)
      // Uncomment if activityLog exists in your schema
      /*
      if (reason) {
        await tx.activityLog.create({
          data: {
            userId,
            action: "INVESTMENT_CANCELLED",
            details: JSON.stringify({ investmentId: id, reason }),
          }
        });
      }
      */
    });

    res.json({ 
      success: true, 
      message: `Investment of ${investmentTokens.toFixed(2)} ${investment.hotelAsset.tokenSymbol || 'tokens'} cancelled successfully`,
      data: {
        cancelledAmount: investmentAmount,
        cancelledTokens: investmentTokens,
        hotelName: investment.hotelAsset.name,
        reason: reason || 'No reason provided'
      }
    });

  } catch (error: any) {
    console.error(' Cancel investment error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to cancel investment",
      details: error.message
    });
  }
};


