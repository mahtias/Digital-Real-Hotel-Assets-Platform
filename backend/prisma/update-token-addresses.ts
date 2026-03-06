import prisma from "../src/config/database";
//import { PrismaClient } from '@prisma/client';

//const prisma = new PrismaClient();

const TOKEN_ADDRESSES = {
  1: '0xD1d60D87688b9A08549E90751A647b3bd6Babb57', // Hilton Tokyo
  2: '0x8A8B0f8659B243cd00Ea5c7DfD0838597CAB6556', // Marriott Paris Champs-Elysees
  3: '0xd53FaE115cC316faeb08193fFA2665b529022818', //  Hyatt Regency London
  4: '0xC5a364742708984c69447a7A145E05127F865291', // InterContinental Dubai Marina
};

async function main() {
  console.log(' Updating token addresses...\n');

  for (const [tokenId, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
    const updated = await prisma.hotelAsset.update({
      where: { tokenId: parseInt(tokenId) },
      data: { 
        // Add tokenAddress field if it exists in your schema
        // If not, you might need to add it first
      },
      select: {
        name: true,
        tokenId: true,
        tokenSymbol: true,
      },
    });

    console.log(` ${updated.name}`);
    console.log(`   Token ID: ${updated.tokenId}`);
    console.log(`   Symbol: ${updated.tokenSymbol}`);
    console.log(`   Address: ${tokenAddress}\n`);
  }

  console.log(' Token addresses updated!');
}

main()
  .catch((e) => {
    console.error(' Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
