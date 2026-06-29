import { Request, Response } from "express";
import { oracleService } from "../services/oracleService";
import prisma from "../config/database";

// POST /admin/oracle/request-performance
export const requestPerformanceUpdate = async (req: Request, res: Response) => {
  try {
    if (!oracleService.isReady()) {
      return res.status(503).json({
        success: false,
        message: "Chainlink not configured. Set CHAINLINK_SUBSCRIPTION_ID in .env — create one at https://functions.chain.link",
      });
    }

    const { hotelAssetId } = req.body;
    if (!hotelAssetId) {
      return res.status(400).json({ success: false, message: "hotelAssetId is required" });
    }

    const hotel = await prisma.hotelAsset.findUnique({
      where: { id: hotelAssetId },
      select: { blockchainId: true, name: true },
    });

    if (!hotel?.blockchainId) {
      return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
    }

    const apiUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/v1/performance/${hotelAssetId}/latest`;

    const result = await oracleService.requestPerformanceUpdate(hotel.blockchainId, apiUrl);

    return res.json({
      success: true,
      message: "Chainlink request sent — performance data will be posted on-chain within ~60 seconds",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /admin/oracle/performance/:hotelAssetId
export const getOnChainPerformance = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.params;

    const hotel = await prisma.hotelAsset.findUnique({
      where: { id: hotelAssetId },
      select: { blockchainId: true, name: true },
    });

    if (!hotel?.blockchainId) {
      return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
    }

    const data = await oracleService.getOnChainPerformance(hotel.blockchainId);

    return res.json({ success: true, data: { hotelName: hotel.name, ...data } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /admin/oracle/hotel/:hotelAssetId
export const getOnChainHotelData = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.params;

    const hotel = await prisma.hotelAsset.findUnique({
      where: { id: hotelAssetId },
      select: { blockchainId: true, name: true },
    });

    if (!hotel?.blockchainId) {
      return res.status(404).json({ success: false, message: "Hotel not found or has no blockchainId" });
    }

    const data = await oracleService.getOnChainHotelData(hotel.blockchainId);

    return res.json({ success: true, data: { hotelName: hotel.name, ...data } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /admin/oracle/status
export const getOracleStatus = async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      contractAddress: process.env.HOTEL_ORACLE_ADDRESS,
      subscriptionConfigured: oracleService.isReady(),
      donId: process.env.CHAINLINK_DON_ID,
      network: "Base Sepolia",
    },
  });
};
