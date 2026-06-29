import { Request, Response } from "express";
import { engineService } from "../services/engineService";

export const getEngineStatus = async (_req: Request, res: Response) => {
  try {
    const enabled = engineService.isEnabled();
    const healthy = enabled ? await engineService.healthCheck() : false;

    return res.json({
      success: true,
      data: {
        enabled,
        healthy,
        url: process.env.THIRDWEB_ENGINE_URL,
        walletConfigured: !!process.env.THIRDWEB_ENGINE_WALLET_ADDRESS,
        mode: enabled ? "thirdweb Engine" : "Direct ethers (fallback)",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionStatus = async (req: Request, res: Response) => {
  try {
    if (!engineService.isEnabled()) {
      return res.status(503).json({ success: false, message: "thirdweb Engine not enabled" });
    }

    const { queueId } = req.params;
    const status = await engineService.getTransactionStatus(queueId);

    return res.json({ success: true, data: status });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listEngineWallets = async (_req: Request, res: Response) => {
  try {
    if (!engineService.isEnabled()) {
      return res.status(503).json({ success: false, message: "thirdweb Engine not enabled" });
    }

    const wallets = await engineService.listWallets();
    return res.json({ success: true, data: wallets });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
