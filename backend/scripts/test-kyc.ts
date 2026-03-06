// scripts/test-kyc.ts

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { kyc } from '../src/blockchain/kyc';

// KYC Levels from your contract
enum KYCLevel {
  NONE = 0,
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3
}

async function checkKYC() {
  const testAddress = process.env.TEST_WALLET_ADDRESS || kyc.account.address;

  console.log('\n🔧 Environment Check:');
  console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
  console.log('RPC_URL exists:', !!process.env.RPC_URL);
  console.log('KYC_CONTRACT_ADDRESS exists:', !!process.env.KYC_CONTRACT_ADDRESS);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 CHECKING KYC STATUS ON BLOCKCHAIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📍 Contract Address:', kyc.address);
  console.log('👤 Wallet:', testAddress);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // ✅ Test 1: Check if KYC is valid (not expired)
    console.log('1️⃣  Checking isKYCValid...');
    const isValid = await kyc.public.readContract({
      address: kyc.address,
      abi: kyc.abi,
      functionName: 'isKYCValid',
      args: [testAddress],
    });
    
    console.log('   ' + (isValid ? '✅ VALID (not expired)' : '❌ INVALID or EXPIRED'));
    console.log('   Result:', isValid);

    // ✅ Test 2: Get KYC data (level, approval status, expiry)
    console.log('\n2️⃣  Checking getKYCData...');
    const kycData = await kyc.public.readContract({
      address: kyc.address,
      abi: kyc.abi,
      functionName: 'getKYCData',
      args: [testAddress],
    }) as [number, boolean, bigint];
    
    const [level, isApproved, expiryDate] = kycData;
    const levelNames = ['NONE', 'BASIC', 'INTERMEDIATE', 'ADVANCED'];
    
    console.log('   📊 KYC Level:', levelNames[level] || 'UNKNOWN', `(${level})`);
    console.log('   ✓  Approved:', isApproved);
    console.log('   📅 Expiry:', expiryDate > 0n 
      ? new Date(Number(expiryDate) * 1000).toISOString() 
      : 'Not set'
    );

    // ✅ Test 3: Check hasValidKYC for each level
    console.log('\n3️⃣  Checking hasValidKYC for each level...');
    
    const levels = [
  { name: 'BASIC', value: 1 },
  { name: 'INTERMEDIATE', value: 2 },
  { name: 'ADVANCED', value: 3 },
];

for (const level of levels) {
  try {
    const hasAccess = await kyc.public.readContract({
      address: kyc.address,
      abi: kyc.abi,
      functionName: 'hasValidKYC',
      args: [kyc.account.address, level.value],
    });
    
    console.log(`   ${hasAccess ? '✅' : '❌'} ${level.name} (level ${level.value}): ${hasAccess}`);
  } catch (error) {
    // When user doesn't have the level, contract reverts
    console.log(`   ❌ ${level.name} (level ${level.value}): false (insufficient level)`);
  }
}

console.log('\n━'.repeat(42));
console.log('✅ KYC CHECK COMPLETE!');
console.log('━'.repeat(42));


    // ✅ Test 4: Check hasKYCLevel for each level
    console.log('\n4️⃣  Checking hasKYCLevel for each level...');
    
    for (const checkLevel of [KYCLevel.BASIC, KYCLevel.INTERMEDIATE, KYCLevel.ADVANCED]) {
      const hasLevel = await kyc.public.readContract({
        address: kyc.address,
        abi: kyc.abi,
        functionName: 'hasKYCLevel',
        args: [testAddress, checkLevel],
      });
      
      const levelName = levelNames[checkLevel];
      const icon = hasLevel ? '✅' : '❌';
      console.log(`   ${icon} ${levelName} (level ${checkLevel}):`, hasLevel);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ KYC CHECK COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Current KYC Level:', levelNames[level]);
    console.log('Is Approved:', isApproved);
    console.log('Is Valid:', isValid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error: any) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ ERROR CHECKING KYC');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', error.shortMessage || error.message);
    console.log('Full error:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

checkKYC();
