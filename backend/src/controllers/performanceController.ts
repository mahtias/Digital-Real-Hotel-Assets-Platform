import { Request, Response } from "express";
import { performanceService } from "../services/performanceService";

export const recordPerformance = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.userId;
    const { hotelAssetId, period } = req.body;

    if (!hotelAssetId) {
      return res.status(400).json({ success: false, message: "hotelAssetId is required" });
    }

    const record = await performanceService.recordPerformance(hotelAssetId, adminId, period);

    return res.status(201).json({
      success: true,
      message: `Performance recorded for period ${record.period}`,
      data: record,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceHistory = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.params;
    const limit = Number(req.query.limit) || 12;

    const history = await performanceService.getPerformanceHistory(hotelAssetId, limit);

    return res.json({ success: true, count: history.length, data: history });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLatestPerformance = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.params;
    const record = await performanceService.getLatestPerformance(hotelAssetId);

    if (!record) {
      return res.status(404).json({ success: false, message: "No performance data yet" });
    }

    return res.json({ success: true, data: record });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHotelsPerformance = async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string | undefined;
    const data = await performanceService.getAllHotelsPerformance(period);

    return res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
