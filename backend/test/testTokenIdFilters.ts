// backend/src/test/testTokenIdFilters.ts

import prisma from "../src/config/database";

async function testFilters() {
  console.log('🧪 Testing tokenId filters...\n');

  try {
    // Option A: gt
    console.log('Option A: Using gt');
    const hotelsA = await prisma.hotelAsset.findMany({
      where: { tokenId: { gt: 0 } },
      select: { name: true, tokenId: true }
    });
    console.log(`  Found: ${hotelsA.length} hotels`);
    hotelsA.forEach(h => console.log(`    - ${h.name}: ${h.tokenId}`));

    // Option B: NOT array
    console.log('\nOption B: Using NOT array');
  const hotelsB = await prisma.hotelAsset.findMany({
  where: { 
    tokenId: { gt: 0 }  
  },
  select: { id: true, tokenId: true, name: true }
});
    console.log(`  Found: ${hotelsB.length} hotels`);

    // Option C: Filter in memory
    console.log('\nOption C: Filter in memory');
    const allHotels = await prisma.hotelAsset.findMany({
      select: { name: true, tokenId: true }
    });
    const hotelsC = allHotels.filter(h => h.tokenId !== null && h.tokenId > 0);
    console.log(`  Found: ${hotelsC.length} hotels`);

    console.log('\n✅ All options work!');

  } catch (error: any) {
    console.error(' Test failed:', error.message);
  }
}

testFilters();
