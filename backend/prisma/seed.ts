import { AssetStatus, UserRole, KycStatus } from '@prisma/client';
import prisma from "../src/config/database";

async function main() {
  // 1. CREATE ADMIN (firstName/lastName)
   const admin = await prisma.user.upsert({
    where: { email: 'admin@digireal.com' },
    update: {},
    create: {
      email: 'admin@digireal.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      walletAddress: '0x742d35Cc6634C0532925a3b8D0e0D7b91c5C3b3e',
      kycStatus: KycStatus.APPROVED,
      isEmailVerified: true
    }
  });
  console.log(' Admin:', admin.email);

  // 2. HOTEL ASSETS
  await prisma.hotelAsset.createMany({
    data: [
      {
        name: "🌟 Grand Palace Hotel",
        location: "Dubai, UAE",
        status: AssetStatus.UPCOMING,
        description: "7-star luxury with Burj Khalifa views",
        apy: 28.5,
        country: "UAE",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
        tokenId: 1,
        tokenPrice: 1000,  
        tokenSymbol: "GPAL",
        totalTokens: 10000,
        tokensSold: 2500,
        totalValue: 8500000,
        occupancyRate: 87,
        roomCount: 150,
        starRating: 7,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      },
      {
        name: " Ocean Breeze Resort",
        location: "Maldives",
        status: AssetStatus.ACTIVE,
        description: "Overwater villas, 92% occupancy",
        apy: 34.2,
        country: "Maldives",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tokenId: 2,
        tokenPrice: 750,  
        tokenSymbol: "OBREEZE",
        totalTokens: 8000,
        tokensSold: 4500,
        totalValue: 6200000,
        occupancyRate: 92,
        roomCount: 80,
        starRating: 6,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      },
      {
        name: " Royal Heritage Inn",
        location: "Paris, France",
        status: AssetStatus.ACTIVE,
        description: "Eiffel Tower views, historic luxury",
        apy: 22.8,
        country: "France",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        tokenId: 3,
        tokenPrice: 1500,  
        tokenSymbol: "ROYAL",
        totalTokens: 12000,
        tokensSold: 3200,
        totalValue: 11200000,
        occupancyRate: 78,
        roomCount: 200,
        starRating: 5,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      },
      {
        name: "🌴 Tropical Paradise Suites",
        location: "Bali, Indonesia",
        status: AssetStatus.UPCOMING,
        description: "Beachfront villas, highest ROI",
        apy: 41.7,
        country: "Indonesia",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920",
        tokenId: 4,
        tokenPrice: 500,  
        tokenSymbol: "TROPIC",
        totalTokens: 6000,
        tokensSold: 1800,
        totalValue: 4800000,
        occupancyRate: 95,
        roomCount: 60,
        starRating: 5,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      }
    ],
    skipDuplicates: true
  });

  //  WAIT for hotels to be created → get IDs
  await new Promise(resolve => setTimeout(resolve, 1000));

  //  INVESTMENTS (hotelAssetId: STRING from created hotels)
  const hotels = await prisma.hotelAsset.findMany({
    where: { isSample: true },
    select: { id: true }
  });

  await prisma.investment.createMany({
  data: [
    {
      userId: admin.id,
      hotelAssetId: hotels[0]?.id!,  
      amount: 5000,
      tokenAmount: 5,           
      investedAmount: 5000,     
      earnedRewards: 0,        
      pendingRewards: 125,      
      stakedAmount: 5000,       
      blockchainStatus: "CONFIRMED",  
      status: "ACTIVE",
      isSample: true
    },
    // ... 3 more (see full code above)
  ]
});


  console.log('✅ 2 Hotels seeded!');
}

main()
  .catch(e => {
    console.error(e);
   // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
