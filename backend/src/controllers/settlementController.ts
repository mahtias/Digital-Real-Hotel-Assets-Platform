import { Request, Response } from "express";
import { settlementService } from "../services/settlementService";

export const processSettlement = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.params;

    const result = await settlementService.processHotelPayout(hotelAssetId);

    return res.json({
      success: true,
      message: "Settlement processed",
      data: result,
    });

  } catch (err: any) {
    console.error("Settlement Error:", err);

    return res.status(500).json({
      success: false,
      message: "Settlement failed",
      error: err.message,
    });
  }
};