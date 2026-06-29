import { Request, Response } from "express";
import { snapshotService } from "../services/snapshotService";

export const takeSnapshot = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user?.userId;
    const { hotelAssetId } = req.body;

    const snapshot = await snapshotService.takeSnapshot(adminId, hotelAssetId);

    return res.status(201).json({
      success: true,
      message: `Snapshot taken with ${snapshot.totalEntries} investor(s)`,
      data: snapshot,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listSnapshots = async (req: Request, res: Response) => {
  try {
    const { hotelAssetId } = req.query;
    const snapshots = await snapshotService.listSnapshots(hotelAssetId as string | undefined);

    return res.json({ success: true, count: snapshots.length, data: snapshots });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSnapshot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snapshot = await snapshotService.getSnapshotById(id);

    if (!snapshot) {
      return res.status(404).json({ success: false, message: "Snapshot not found" });
    }

    return res.json({ success: true, data: snapshot });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
