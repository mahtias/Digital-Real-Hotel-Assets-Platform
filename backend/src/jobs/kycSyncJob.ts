// backend/src/jobs/kycSyncJob.ts

import cron from 'node-cron';
import { Web3Service } from '../services/web3Service';

const web3Service = new Web3Service();

/**
 * 🔄 Run every hour: Sync pending KYCs to blockchain
 */
export function startKycSyncJob() {
  // Run at minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    console.log('\n🔄 [CRON] Starting hourly KYC sync job...');
    console.log(`📅 Time: ${new Date().toISOString()}`);

    try {
      const result = await web3Service.syncAllPendingKycs();

      console.log('✅ [CRON] KYC sync job completed');
      console.log(`   ✓ Synced: ${result.synced}`);
      console.log(`   ✗ Failed: ${result.failed}`);

      if (result.failed > 0) {
        console.warn(`⚠️ [CRON] ${result.failed} user(s) failed to sync to blockchain`);
      }

    } catch (error: any) {
      console.error('❌ [CRON] KYC sync job failed:', error.message);
      console.error('Stack:', error.stack);
    }
  });

  console.log('✅ KYC sync job scheduled (runs every hour at :00)');
  console.log('⏰ Next run:', getNextCronRun());
}

/**
 * 🧪 Manual trigger for testing
 */
export async function triggerKycSync() {
  console.log('\n🔄 Manually triggering KYC sync...');
  console.log(`📅 Time: ${new Date().toISOString()}`);
  
  try {
    const result = await web3Service.syncAllPendingKycs();
    
    console.log('\n📊 Sync Results:');
    console.log(`   ✓ Synced: ${result.synced}`);
    console.log(`   ✗ Failed: ${result.failed}`);
    
    return result;
    
  } catch (error: any) {
    console.error('❌ Manual sync failed:', error.message);
    throw error;
  }
}

/**
 * 🧪 Test job (runs every minute for debugging)
 */
export function startKycSyncJobTest() {
  cron.schedule('* * * * *', async () => {
    console.log('\n🧪 [TEST CRON] Running KYC sync (every minute)...');
    
    try {
      const result = await web3Service.syncAllPendingKycs();
      console.log(` [TEST] Synced: ${result.synced}, Failed: ${result.failed}`);
    } catch (error: any) {
      console.error(' [TEST] Sync failed:', error.message);
    }
  });

  console.log('🧪 Test KYC sync job started (runs every minute)');
}

/**
 * 📅 Get next cron run time
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
