  // backend/src/jobs/kycSyncJob.ts

  import cron from 'node-cron';
  import { web3Service } from "../services/web3Service";
import { Mutex } from "async-mutex";

 const mutex = new Mutex();
  /**
   *  Run every 5 mn: Sync pending KYCs to blockchain
   */
let isKycSyncRunning = false;

export function startKycSyncJob() {
cron.schedule("*/5 * * * *", async () => {
  const release = await mutex.acquire();

  try {
    console.log("\n[CRON] Starting KYC sync job...");
    console.log(`Time: ${new Date().toISOString()}`);

    const result = await web3Service.syncAllPendingKycs();

    console.log("[CRON] KYC sync job completed");
    console.log(`Synced: ${result.synced}`);
    console.log(`Failed: ${result.failed}`);

  } catch (error: any) {
    console.error("[CRON] KYC sync job failed:", error.message);
  } finally {
    release();
  }
});

  console.log("KYC sync job scheduled (runs every 5 minutes)");
  console.log("Next run:", getNextCronRun());
}

  /**
   *  Manual trigger for testing
   */
 export async function triggerKycSync() {
  if (isKycSyncRunning) {
    console.warn("[MANUAL] Sync already running, skipping");
    return;
  }

  isKycSyncRunning = true;

  console.log('\n Manually triggering KYC sync...');
  console.log(` Time: ${new Date().toISOString()}`);

  try {
    const result = await web3Service.syncAllPendingKycs();

    console.log('\n Sync Results:');
    console.log(`   ✓ Synced: ${result.synced}`);
    console.log(`   ✗ Failed: ${result.failed}`);

    console.log(`[MANUAL] Done → Synced: ${result.synced}, Failed: ${result.failed}`);

    return result;

  } catch (error: any) {
    console.error('Manual sync failed:', error.message);
    throw error;

  } finally {
    isKycSyncRunning = false;
  }
}

  /**
   *  Test job (runs every minute for debugging)
   */
  export function startKycSyncJobTest() {
    cron.schedule('* * * * *', async () => {
    console.log('\n [TEST CRON] Running KYC sync (every minute)...');

    try {
      const result = await web3Service.syncAllPendingKycs();
      console.log(`[TEST] Synced: ${result.synced}, Failed: ${result.failed}`);
    } catch (error: any) {
      console.error('[TEST] Sync failed:', error.message);
    }
  });

    console.log(' Test KYC sync job started (runs every minute)');
  }

  

  /**
   *  Get next cron run time
   */
  function getNextCronRun(): string {
    const now = new Date();
    const next = new Date(now);
    next.setHours(now.getHours() + 1, 0, 0, 0);
    return next.toLocaleString();
  }

  /**
   *  Stop all cron jobs (useful for testing)
   */
  export function stopAllKycJobs() {
    cron.getTasks().forEach(task => task.stop());
    console.log(' All KYC cron jobs stopped');
  }
