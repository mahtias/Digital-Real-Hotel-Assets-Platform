"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEngineWallets = exports.getTransactionStatus = exports.getEngineStatus = void 0;
const engineService_1 = require("../services/engineService");
const getEngineStatus = async (_req, res) => {
    try {
        const enabled = engineService_1.engineService.isEnabled();
        const healthy = enabled ? await engineService_1.engineService.healthCheck() : false;
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getEngineStatus = getEngineStatus;
const getTransactionStatus = async (req, res) => {
    try {
        if (!engineService_1.engineService.isEnabled()) {
            return res.status(503).json({ success: false, message: "thirdweb Engine not enabled" });
        }
        const { queueId } = req.params;
        const status = await engineService_1.engineService.getTransactionStatus(queueId);
        return res.json({ success: true, data: status });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTransactionStatus = getTransactionStatus;
const listEngineWallets = async (_req, res) => {
    try {
        if (!engineService_1.engineService.isEnabled()) {
            return res.status(503).json({ success: false, message: "thirdweb Engine not enabled" });
        }
        const wallets = await engineService_1.engineService.listWallets();
        return res.json({ success: true, data: wallets });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.listEngineWallets = listEngineWallets;
//# sourceMappingURL=engineController.js.map