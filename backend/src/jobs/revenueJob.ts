import { yieldService } from "../services/yieldService";
import { settlementService } from "../services/settlementService";
import cron from "node-cron";

export const startRevenueJob = () => {
  console.log("⏰ Starting Revenue Cron Job (Yield + Settlements)...");

  // Schedule: every hour
  cron.schedule("0 * * * *", async () => {
    console.log("🚀 Revenue job running...");

    try {
      console.log("💸 Distributing pending yields...");
      await yieldService.distributePendingYields(); 
    } catch (err) {
      console.error("❌ Yield distribution error:", err);
    }

    try {
      console.log("🏨 Processing pending hotel payouts...");
      await settlementService.processAllPendingPayouts(); 
    } catch (err) {
      console.error("❌ Hotel payout error:", err);
    }

    console.log("✅ Revenue job finished");
  });
};