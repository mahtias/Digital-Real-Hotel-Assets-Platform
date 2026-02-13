import { AssetStatus, UserRole, KycStatus } from '@prisma/client';
import prisma from "../src/config/database"; 
//const prisma = new PrismaClient();

async function main() {
  // 1. CREATE ADMIN (firstName/lastName)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@digireal.com' },
    update: {},
    create: {
      email: 'admin@digireal.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      firstName: 'Admin',           // ✅ firstName
      lastName: 'User',             // ✅ lastName
      role: UserRole.ADMIN,
      walletAddress: '0x742d35Cc6634C0532925a3b8D0e0D7b91c5C3b3e',
      kycStatus: KycStatus.APPROVED,
      isEmailVerified: true
    }
  });

  console.log('✅ Admin:', admin.email);

  // 2. HOTEL ASSETS
  await prisma.hotelAsset.createMany({
    data: [
      {
        name: "Paris Luxury Suites",
        location: "Paris, France",
        status: AssetStatus.UPCOMING,
        description: "5-star suites with Eiffel view",
        apy: 12.5,
        country: "France",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
        tokenId: 1,
        tokenPrice: 100,
        tokenSymbol: "PARIS",
        totalTokens: 10000,
        tokensSold: 0,
        totalValue: 1000000,
        occupancyRate: 85.5,
        roomCount: 50,
        starRating: 5,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      },
      {
        name: "Dubai Sky Palace",
        location: "Dubai, UAE",
        status: AssetStatus.UPCOMING,
        description: "7-star Burj Khalifa views",
        apy: 15.2,
        country: "UAE",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500",
        tokenId: 2,
        tokenPrice: 250,
        tokenSymbol: "DUBAI",
        totalTokens: 8000,
        tokensSold: 500,
        totalValue: 2000000,
        occupancyRate: 92.1,
        roomCount: 120,
        starRating: 7,
        createdById: admin.id,
        createdBy: "admin",
        isSample: true
      }
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
