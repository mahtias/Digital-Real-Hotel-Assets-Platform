"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKycSyncJob = startKycSyncJob;
exports.triggerKycSync = triggerKycSync;
exports.startKycSyncJobTest = startKycSyncJobTest;
exports.stopAllKycJobs = stopAllKycJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const web3Service_1 = require("../services/web3Service");
const async_mutex_1 = require("async-mutex");
const mutex = new async_mutex_1.Mutex();
let isKycSyncRunning = false;
function startKycSyncJob() {
    node_cron_1.default.schedule("*/5 * * * *", async () => {
        const release = await mutex.acquire();
        try {
            console.log("\n[CRON] Starting KYC sync job...");
            console.log(`Time: ${new Date().toISOString()}`);
            const result = await web3Service_1.web3Service.syncAllPendingKycs();
            console.log("[CRON] KYC sync job completed");
            console.log(`Synced: ${result.synced}`);
            console.log(`Failed: ${result.failed}`);
        }
        catch (error) {
            console.error("[CRON] KYC sync job failed:", error.message);
        }
        finally {
            release();
        }
    });
    console.log("KYC sync job scheduled (runs every 5 minutes)");
    console.log("Next run:", getNextCronRun());
}
async function triggerKycSync() {
    if (isKycSyncRunning) {
        console.warn("[MANUAL] Sync already running, skipping");
        return;
    }
    isKycSyncRunning = true;
    console.log('\n Manually triggering KYC sync...');
    console.log(` Time: ${new Date().toISOString()}`);
    try {
        const result = await web3Service_1.web3Service.syncAllPendingKycs();
        console.log('\n Sync Results:');
        console.log(`   ✓ Synced: ${result.synced}`);
        console.log(`   ✗ Failed: ${result.failed}`);
        console.log(`[MANUAL] Done → Synced: ${result.synced}, Failed: ${result.failed}`);
        return result;
    }
    catch (error) {
        console.error('Manual sync failed:', error.message);
        throw error;
    }
    finally {
        isKycSyncRunning = false;
    }
}
function startKycSyncJobTest() {
    node_cron_1.default.schedule('* * * * *', async () => {
        console.log('\n [TEST CRON] Running KYC sync (every minute)...');
        try {
            const result = await web3Service_1.web3Service.syncAllPendingKycs();
            console.log(`[TEST] Synced: ${result.synced}, Failed: ${result.failed}`);
        }
        catch (error) {
            console.error('[TEST] Sync failed:', error.message);
        }
    });
    console.log(' Test KYC sync job started (runs every minute)');
}
function getNextCronRun() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(now.getHours() + 1, 0, 0, 0);
    return next.toLocaleString();
}
function stopAllKycJobs() {
    node_cron_1.default.getTasks().forEach(task => task.stop());
    console.log(' All KYC cron jobs stopped');
}
//# sourceMappingURL=kycSyncJob.js.map