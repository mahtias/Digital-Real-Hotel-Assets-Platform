import { Request, Response } from "express";
import prisma from "../config/database"; 
import { web3Service } from "../services/web3Service";


interface AuthRequest extends Request {
  user?: {
    userId: string;        
    email?: string;
    role: string;
    walletAddress?: string | null;
  };
}

export const createInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { hotelId, amount, walletAddress } = req.body;
    const userId = req.user?.userId!;
    
    if (!hotelId || !amount || !walletAddress || !userId) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    //  1. KYC CHECK
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true }
    });
    if (!user?.kycStatus || user.kycStatus !== 'APPROVED') {
      return res.status(403).json({ success: false, error: 'KYC required' });
    }

    // 2. HOTEL ASSET (THIS WAS MISSING!)
    const hotelAsset = await prisma.hotelAsset.findUnique({
      where: { id: hotelId },
      select: { 
        id: true,
        tokenPrice: true,
        name: true 
      }
    });

    if (!hotelAsset?.tokenPrice) {
      return res.status(400).json({ success: false, error: 'Invalid hotel' });
    }

    //  3. CALCULATE TOKENS
    const tokenAmount = Math.floor(Number(amount) / Number(hotelAsset.tokenPrice));

    //  4. CREATE INVESTMENT (PERFECT!)
    const investment = await prisma.investment.create({
      data: {
        userId,
        hotelAssetId: hotelId,
        walletAddress,
        tokenAmount,
        investedAmount: Number(amount),
        amount: Number(amount),
        earnedRewards: 0,
        pendingRewards: 0,
        stakedAmount: 0,
        blockchainStatus: "PENDING"
      },
      include: {
        user: true,
        hotelAsset: true
      }
    });

    //  5. WEB3 MINT (BACKGROUND)
    (async () => {
      try {
        const txHash = await web3Service.mintInvestmentTokens(
          hotelId, 
          walletAddress, 
          tokenAmount
        );
        await prisma.investment.update({
          where: { id: investment.id },
          data: { 
            blockchainTxHash: txHash,
            blockchainStatus: "MINTED"
          }
        });
      } catch (error) {
        await prisma.investment.update({
          where: { id: investment.id },
          data: { blockchainStatus: "MINT_FAILED" }
        });
      }
    })();

    res.json({ 
      success: true, 
      data: investment,
      message: ` Invested $${amount}! ${tokenAmount} tokens minting in ${hotelAsset.name}...`
    });

  } catch (error: any) {
    console.error(' Investment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


//  Other functions (already working)
export const getUserInvestments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { hotelAsset: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//  ADD THESE 3 (after getUserInvestments):

// 3. GET SINGLE INVESTMENT
export const getInvestmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const investment = await prisma.investment.findFirst({
      where: { id, userId },  //  User owns this investment only
      include: { 
        hotelAsset: { 
          select: { id: true, name: true, tokenPrice: true }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ success: false, error: "Investment not found" });
    }

    res.json({ success: true, data: investment });
  } catch (error: any) {
    console.error(' Get investment error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 4. UPDATE INVESTMENT
export const updateInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { amount, walletAddress } = req.body;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const investment = await prisma.investment.findFirst({
      where: { id, userId }
    });

    if (!investment) {
      return res.status(404).json({ success: false, error: "Investment not found" });
    }

    const updatedInvestment = await prisma.investment.update({
      where: { id: investment.id },
      data: {
        amount: amount ? Number(amount) : investment.amount,
        investedAmount: amount ? Number(amount) : investment.investedAmount,
        walletAddress: walletAddress || investment.walletAddress
      },
      include: { hotelAsset: true }
    });

    res.json({ 
      success: true, 
      data: updatedInvestment,
      message: "Investment updated successfully"
    });
  } catch (error: any) {
    console.error(' Update investment error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 5. DELETE INVESTMENT (Soft delete)
export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const investment = await prisma.investment.findFirst({
      where: { id, userId }
    });

    if (!investment) {
      return res.status(404).json({ success: false, error: "Investment not found" });
    }

    await prisma.investment.update({
      where: { id },
      data: { 
        blockchainStatus: "DELETED",
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: "Investment deleted successfully" 
    });
  } catch (error: any) {
    console.error(' Delete investment error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

