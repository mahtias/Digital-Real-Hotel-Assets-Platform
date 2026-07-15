"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshot = exports.listSnapshots = exports.takeSnapshot = void 0;
const snapshotService_1 = require("../services/snapshotService");
const takeSnapshot = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        const { hotelAssetId } = req.body;
        const snapshot = await snapshotService_1.snapshotService.takeSnapshot(adminId, hotelAssetId);
        return res.status(201).json({
            success: true,
            message: `Snapshot taken with ${snapshot.totalEntries} investor(s)`,
            data: snapshot,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.takeSnapshot = takeSnapshot;
const listSnapshots = async (req, res) => {
    try {
        const { hotelAssetId } = req.query;
        const snapshots = await snapshotService_1.snapshotService.listSnapshots(hotelAssetId);
        return res.json({ success: true, count: snapshots.length, data: snapshots });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.listSnapshots = listSnapshots;
const getSnapshot = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await snapshotService_1.snapshotService.getSnapshotById(id);
        if (!snapshot) {
            return res.status(404).json({ success: false, message: "Snapshot not found" });
        }
        return res.json({ success: true, data: snapshot });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSnapshot = getSnapshot;
//# sourceMappingURL=snapshotController.js.map