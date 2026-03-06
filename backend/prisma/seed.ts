import { PrismaClient, AssetStatus, VerificationLevel, KycStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from "../src/config/database";

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.investment.deleteMany();
  await prisma.hotelAsset.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Admin123!@#', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      walletAddress: '0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb',
      email: 'admin@digirealassets.com',
      password: hashedPassword,
      kycStatus: KycStatus.APPROVED,
      verificationLevel: VerificationLevel.FULL,
    },
  });

  console.log('✅ Created admin user');

  // 🔥 CREATE THE 4 HOTELS ACTUALLY DEPLOYED ON BLOCKCHAIN
  const hotels = await Promise.all([
    // 🏨 HOTEL 1: Grand Plaza Hotel (HOTEL001)
    prisma.hotelAsset.create({
      data: {
        name: 'Grand Plaza Hotel',
        location: 'New York, USA',
        country: 'United States',
        status: AssetStatus.ACTIVE,
        description: 'Luxury hotel in the heart of Manhattan with premium amenities',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',

        // ✅ ADD BOTH tokenId AND blockchainId
        blockchainId: 0, // ✅ ADD THIS!
        tokenId: 0,
        tokenSymbol: 'GPH',
        tokenAddress: '0x1aD854F22927bB91c54e8FbC5F59b286eE3965a3',
        tokenPrice: 100,
        totalTokens: 1000000,
        tokensSold: 0,
        totalValue: 100000000,

        starRating: 5,
        roomCount: 250,
        occupancyRate: 85.0,
        apy: 12.0,
        revpar: 200,
        esgScore: 88,

        createdById: adminUser.id,
        createdBy: adminUser.walletAddress,
        isSample: false,
      },
    }),

    // 🏨 HOTEL 2: Grand Plaza Hotel (HOTEL004) - Duplicate name
    prisma.hotelAsset.create({
      data: {
        name: 'Grand Plaza Hotel - Branch 2',
        location: 'New York, USA',
        country: 'United States',
        status: AssetStatus.ACTIVE,
        description: 'Second location of Grand Plaza Hotel in Manhattan',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',

        blockchainId: 1, // ✅ ADD THIS!
        tokenId: 1,
        tokenSymbol: 'GPH4',
        tokenAddress: '0xFd9F285B5b4759d7c38BF71CBe10A07aCA09610B',
        tokenPrice: 100,
        totalTokens: 1000000,
        tokensSold: 0,
        totalValue: 100000000,

        starRating: 5,
        roomCount: 220,
        occupancyRate: 82.0,
        apy: 11.5,
        revpar: 190,
        esgScore: 85,

        createdById: adminUser.id,
        createdBy: adminUser.walletAddress,
        isSample: false,
      },
    }),

    // 🏨 HOTEL 3: Beach Resort Paradise (HOTEL005)
    prisma.hotelAsset.create({
      data: {
        name: 'Beach Resort Paradise',
        location: 'Miami, USA',
        country: 'United States',
        status: AssetStatus.ACTIVE,
        description: 'Tropical beachfront resort with stunning ocean views',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',

        blockchainId: 2, // ✅ ADD THIS!
        tokenId: 2,
        tokenSymbol: 'BRP5',
        tokenAddress: '0x3AA7703D6464199279F0DA98AC54C7CA7EA4BfB0',
        tokenPrice: 150,
        totalTokens: 500000,
        tokensSold: 0,
        totalValue: 75000000,

        starRating: 5,
        roomCount: 180,
        occupancyRate: 90.0,
        apy: 14.0,
        revpar: 250,
        esgScore: 92,

        createdById: adminUser.id,
        createdBy: adminUser.walletAddress,
        isSample: false,
      },
    }),

    // 🏨 HOTEL 4: Mountain View Lodge (HOTEL006)
    prisma.hotelAsset.create({
      data: {
        name: 'Mountain View Lodge',
        location: 'Colorado, USA',
        country: 'United States',
        status: AssetStatus.ACTIVE,
        description: 'Luxury mountain resort perfect for skiing and outdoor activities',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',

        blockchainId: 3, // ✅ ADD THIS!
        tokenId: 3,
        tokenSymbol: 'MVL6',
        tokenAddress: '0xa01763D10df5D90f64309aCE98Be62f9908A5086',
        tokenPrice: 80,
        totalTokens: 750000,
        tokensSold: 0,
        totalValue: 60000000,

        starRating: 4,
        roomCount: 150,
        occupancyRate: 78.0,
        apy: 10.0,
        revpar: 180,
        esgScore: 90,

        createdById: adminUser.id,
        createdBy: adminUser.walletAddress,
        isSample: false,
      },
    }),
  ]);

  console.log(`✅ Created ${hotels.length} hotel assets`);

  // Display summary
  console.log('\n📊 Seeding Summary:');
  console.log('├─ Admin User:', adminUser.walletAddress);
  console.log('├─ Hotels Created:', hotels.length);
  console.log('│');
  hotels.forEach((hotel, index) => {
    console.log(`├─ Hotel ${index}:`);
    console.log(`│  ├─ Name: ${hotel.name}`);
    console.log(`│  ├─ Blockchain ID: ${hotel.blockchainId}`); // ✅ UPDATED!
    console.log(`│  ├─ Token ID: ${hotel.tokenId}`);
    console.log(`│  ├─ Token Address: ${hotel.tokenAddress}`);
    console.log(`│  ├─ Symbol: ${hotel.tokenSymbol}`);
    console.log(`│  └─ Total Value: $${hotel.totalValue?.toLocaleString()}`);
  });

  console.log('\n✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
