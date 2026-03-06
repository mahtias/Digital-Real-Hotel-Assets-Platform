//import { PrismaClient } from '@prisma/client';
import prisma from "../src/config/database";
//const prisma = new PrismaClient();

const tokenData = [
  {
    name: 'Hilton Tokyo Bay',
    tokenSymbol: 'HAT-HIL',
    tokenAddress: '0xD1d60D87688b9A08549E90751A647b3bd6Babb57',
    totalTokens: 1000,
    tokensSold: 0,
    tokenPrice: 50000 // $500 per token (in cents)
  },
  {
    name: 'Marriott Paris',
    tokenSymbol: 'HAT-MAR',
    tokenAddress: '0x8A8B0f8659B243cd00Ea5c7DfD0838597CAB6556',
    totalTokens: 1000,
    tokensSold: 0,
    tokenPrice: 75000 // $750 per token
  },
  {
    name: 'Hyatt Regency London',
    tokenSymbol: 'HAT-HYA',
    tokenAddress: '0xd53FaE115cC316faeb08193fFA2665b529022818',
    totalTokens: 1000,
    tokensSold: 0,
    tokenPrice: 100000 // $1000 per token
  },
  {
    name: 'InterContinental Dubai',
    tokenSymbol: 'HAT-ICD',
    tokenAddress: '0xC5a364742708984c69447a7A145E05127F865291',
    totalTokens: 1000,
    tokensSold: 0,
    tokenPrice: 60000 // $600 per token
  }
];

async function main() {
  console.log('🔄 Updating Hotel Assets with Token Information...\n');

  for (const data of tokenData) {
    try {
      // Find hotel by name (partial match on first word)
      const hotel = await prisma.hotelAsset.findFirst({
        where: { 
          name: { 
            contains: data.name.split(' ')[0],
            mode: 'insensitive'
          }
        }
      });

      if (hotel) {
        await prisma.hotelAsset.update({
          where: { id: hotel.id },
          data: {
            tokenSymbol: data.tokenSymbol,
            tokenAddress: data.tokenAddress,
            totalTokens: data.totalTokens,
            tokensSold: data.tokensSold,
            tokenPrice: data.tokenPrice,
            totalValue: data.totalTokens * data.tokenPrice,
            status: 'ACTIVE'
          }
        });
        console.log(`✅ Updated: ${data.name}`);
        console.log(`   ├─ Token: ${data.tokenSymbol}`);
        console.log(`   ├─ Address: ${data.tokenAddress}`);
        console.log(`   ├─ Total Tokens: ${data.totalTokens}`);
        console.log(`   └─ Price: $${data.tokenPrice / 100}\n`);
      } else {
        console.log(`❌ Not found: ${data.name}\n`);
      }
    } catch (error: any) {
      console.error(`❌ Error updating ${data.name}:`, error.message, '\n');
    }
  }

  console.log('✨ Update complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
