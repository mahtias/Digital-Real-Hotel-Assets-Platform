import dotenv from 'dotenv';
dotenv.config();

import factoryService from '../src/services/factoryService';
import { ethers } from 'ethers';

async function viewAllHotels() {
  try {
    console.log('🏨 Fetching All Hotel Tokens...\n');

    const allTokens = await factoryService.getAllTokens();
    console.log(`📊 Total Hotels: ${allTokens.length}\n`);

    for (let i = 0; i < allTokens.length; i++) {
      const tokenAddress = allTokens[i];
      
      console.log(`${'='.repeat(60)}`);
      console.log(`🏨 HOTEL ${i + 1}`);
      console.log(`${'='.repeat(60)}\n`);

      try {
        const token = factoryService.getTokenContract(tokenAddress);

        // Get basic info
        const [name, symbol, hotelId, hotelName, location, maxSupply, tokenPriceUSD, totalSupply] = 
          await Promise.all([
            token.name(),
            token.symbol(),
            token.hotelId(),
            token.hotelName(),
            token.location(),
            token.maxSupply(),
            token.tokenPriceUSD(),
            token.totalSupply()
          ]);

        const remainingSupply = maxSupply - totalSupply;

        console.log(`📍 Token Address: ${tokenAddress}`);
        console.log(`🏨 Name: ${name}`);
        console.log(`🆔 Hotel ID: ${hotelId}`);
        console.log(`🏢 Hotel Name: ${hotelName}`);
        console.log(`📍 Location: ${location}`);
        console.log(`🔤 Symbol: ${symbol}`);
        console.log(`💰 Token Price: $${tokenPriceUSD} USD`);
        console.log(`📦 Max Supply: ${ethers.formatEther(maxSupply)} tokens`);
        console.log(`📊 Total Supply: ${ethers.formatEther(totalSupply)} tokens`);
        console.log(`📦 Remaining: ${ethers.formatEther(remainingSupply)} tokens`);
        console.log(`🌐 Explorer: https://sepolia.basescan.org/address/${tokenAddress}\n`);

      } catch (error: any) {
        console.error(`❌ Error getting info for ${tokenAddress}:`, error.message);
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewAllHotels();
