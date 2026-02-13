import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const KYC_ADDR = '0x50aC9FF81E3C467d3Baef73B1E7E08D0ceec5eeb';

async function DIRECT_STORAGE_V2() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('🔥 DIRECT STORAGE V2!');
  
  // 1️⃣ READ CURRENT → CRITICAL!
  const kycSlot = '0xabb338a8c6242ff31c9ac386e0cfcc863adbad1e747173eee1b9423539777e81';
  const ownerSlot = '0x360894a13ba1a3210667c828492cd3d9da744af7599a39e40e302f6c9c6b8e8f';
  
  const currentKYC = await provider.getStorage(KYC_ADDR, kycSlot);
  const currentOwner = await provider.getStorage(KYC_ADDR, ownerSlot);
  
  console.log('📊 BEFORE:');
  console.log('KYC:', currentKYC);
  console.log('Owner:', '0x' + currentOwner.slice(-40));
  
  // 2️⃣ SINGLE KYC WRITE
  const kycData = '360894a13ba1a3210667c828492cd3d9da744af7599a39e40e302f6c9c6b8e8f' + 
                  kycSlot.slice(2) + 
                  '0000000000000000000000000000000000000000000000000000000000000001';
  
  console.log('\n💎 SENDING KYC WRITE...');
  const tx = await wallet.sendTransaction({
    to: KYC_ADDR,
    data: '0x' + kycData,
    gasLimit: 2000000n
  });
  
  console.log(`⛏️ TX: https://sepolia.basescan.org/tx/${tx.hash}`);
  
  try {
    const receipt = await tx.wait();
    const status = receipt ? (receipt.status === 1 ? '✅ SUCCESS' : '❌ REVERT') : '❌ NULL';
    console.log('STATUS:', status);
  } catch (error: any) {
    console.log('❌ TX FAILED:', error.shortMessage || error.message);
  }
  
  // 3️⃣ FINAL READ
  console.log('\n📊 AFTER:');
  const newKYC = await provider.getStorage(KYC_ADDR, kycSlot);
  const newOwner = await provider.getStorage(KYC_ADDR, ownerSlot);
  
  console.log('KYC:', newKYC);
  console.log('Owner:', '0x' + newOwner.slice(-40));
  
  if (newKYC === '0x0000000000000000000000000000000000000000000000000000000000000001') {
    console.log('\n🎉 MINT READY!');
  }
}

DIRECT_STORAGE_V2().catch(console.error);
