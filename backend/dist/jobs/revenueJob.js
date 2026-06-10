"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRevenueJob = void 0;
const yieldService_1 = require("../services/yieldService");
const settlementService_1 = require("../services/settlementService");
const node_cron_1 = __importDefault(require("node-cron"));
const startRevenueJob = () => {
    console.log("⏰ Starting Revenue Cron Job (Yield + Settlements)...");
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("🚀 Revenue job running...");
        try {
            console.log("💸 Distributing pending yields...");
            await yieldService_1.yieldService.distributePendingYields();
        }
        catch (err) {
            console.error("❌ Yield distribution error:", err);
        }
        try {
            console.log("🏨 Processing pending hotel payouts...");
            await settlementService_1.settlementService.processAllPendingPayouts();
        }
        catch (err) {
            console.error("❌ Hotel payout error:", err);
        }
        console.log("✅ Revenue job finished");
    });
};
exports.startRevenueJob = startRevenueJob;
//# sourceMappingURL=revenueJob.js.map