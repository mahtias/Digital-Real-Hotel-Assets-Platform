const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const prisma = new PrismaClient();

// Helper to safely parse numbers
const parseNumber = (value) => {
  if (!value) return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const parseInt2 = (value) => {
  if (!value) return 0;
  const num = parseInt(value);
  return isNaN(num) ? 0 : num;
};

// Enum mappers
const mapAssetStatus = (status) => {
  const statusMap = {
    'active': 'ACTIVE',
    'upcoming': 'UPCOMING',
    'sold_out': 'SOLD_OUT',
    'closed': 'CLOSED'
  };
  return statusMap[status?.toLowerCase()] || 'ACTIVE';
};

const mapUserRole = (role) => {
  const roleMap = {
    'investor': 'USER',
    'admin': 'ADMIN',
    'user': 'USER',
    'manager': 'ADMIN'
  };
  return roleMap[role?.toLowerCase()] || 'USER';
};

const mapProposalType = (type) => {
  const typeMap = {
    'general': 'OTHER',
    'renovation': 'RENOVATION',
    'expansion': 'EXPANSION',
    'policy_change': 'POLICY_CHANGE',
    'policy': 'POLICY_CHANGE',
    'dividend_distribution': 'DIVIDEND_DISTRIBUTION',
    'dividend': 'DIVIDEND_DISTRIBUTION'
  };
  return typeMap[type?.toLowerCase()] || 'OTHER';
};

const mapProposalStatus = (status) => {
  const statusMap = {
    'draft': 'DRAFT',
    'active': 'ACTIVE',
    'approved': 'APPROVED',
    'passed': 'APPROVED',
    'rejected': 'REJECTED',
    'executed': 'EXECUTED'
  };
  return statusMap[status?.toLowerCase()] || 'DRAFT';
};

async function importFromCSV() {
  try {
    console.log('📥 Starting CSV import...\n');

    const readCSV = (filename) => {
      const filePath = path.join(__dirname, 'data', filename);
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping...`);
        return null;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      return parse(content, { 
        columns: true, 
        skip_empty_lines: true
      });
    };

    // 1. Import Users FIRST
    const users = readCSV('users.csv');
    let defaultUserId;

    if (users && users.length > 0) {
      console.log('👥 Importing Users...');
      let successCount = 0;
      
      for (const user of users) {
        try {
          if (!user.email) {
            console.log(`⚠️  Skipping user - missing email`);
            continue;
          }

          // Split name into firstName and lastName if provided
          let firstName = user.firstName || user.name || user.email.split('@')[0];
          let lastName = user.lastName || '';
          
          if (user.name && !user.firstName && !user.lastName) {
            const nameParts = user.name.split(' ');
            firstName = nameParts[0] || user.email.split('@')[0];
            lastName = nameParts.slice(1).join(' ') || '';
          }

          const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              firstName: firstName,
              lastName: lastName,
              walletAddress: user.walletAddress || null,
              role: mapUserRole(user.role)
            },
            create: {
              id: user.id || undefined,
              email: user.email,
              firstName: firstName,
              lastName: lastName,
              password: user.password || '$2b$10$defaultHashedPassword',
              walletAddress: user.walletAddress || null,
              role: mapUserRole(user.role),
             
            }
          });
          
          if (!defaultUserId) defaultUserId = createdUser.id;
          successCount++;
          console.log(` Imported: ${user.email} (${firstName} ${lastName})`);
        } catch (err) {
          console.error(` Error importing user ${user.email}:`, err.message);
        }
      }
      console.log(`\n Successfully imported ${successCount}/${users.length} users\n`);
    }



    // Get or create default user if no users imported
    if (!defaultUserId) {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        defaultUserId = existingUser.id;
      } else {
        const systemUser = await prisma.user.create({
          data: {
            email: 'system@digirealassets.com',
            walletAddress: '0x0000000000000000000000000000000000000000',
            name: 'System Admin',
            draBalance: 0
          }
        });
        defaultUserId = systemUser.id;
        console.log(' Created system user for imports\n');
      }
    }

    // 2. Import Hotel Assets
    const hotels = readCSV('HotelAsset_export.csv');
    if (hotels) {
      console.log(' Importing Hotel Assets...');
      let successCount = 0;

      for (const hotel of hotels) {
        try {
          const imageUrl = hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

          await prisma.hotelAsset.upsert({
            where: { id: hotel.id },
            update: {
              name: hotel.name,
              description: hotel.description || 'Luxury hotel property',
              location: hotel.location,
              country: hotel.country,
              tokenSymbol: hotel.tokenSymbol || hotel.name.substring(0, 6).toUpperCase(),
              imageUrl: imageUrl,
              totalValue: parseNumber(hotel.totalValue),
              totalTokens: parseInt2(hotel.totalTokens) || 10000,
              tokensSold: parseInt2(hotel.tokensSold) || 0,
              tokenPrice: parseNumber(hotel.tokenPrice) || 100,
              apy: parseNumber(hotel.apy) || 8.5,
              occupancyRate: parseNumber(hotel.occupancyRate) || 75,
              revpar: parseNumber(hotel.revpar) || 150,
              esgScore: parseInt2(hotel.esgScore) || 80,
              roomCount: parseInt2(hotel.roomCount) || 100,
              starRating: parseInt2(hotel.starRating) || 5,
              status: mapAssetStatus(hotel.status),
              leaseEndDate: hotel.leaseEndDate ? new Date(hotel.leaseEndDate) : new Date('2035-12-31'),
              isSample: hotel.isSample === 'true' || false,
              createdById: hotel.createdById || defaultUserId
            },
            create: {
              id: hotel.id,
              name: hotel.name,
              description: hotel.description || 'Luxury hotel property',
              location: hotel.location,
              country: hotel.country,
              tokenSymbol: hotel.tokenSymbol || hotel.name.substring(0, 6).toUpperCase(),
              imageUrl: imageUrl,
              totalValue: parseNumber(hotel.totalValue),
              totalTokens: parseInt2(hotel.totalTokens) || 10000,
              tokensSold: parseInt2(hotel.tokensSold) || 0,
              tokenPrice: parseNumber(hotel.tokenPrice) || 100,
              apy: parseNumber(hotel.apy) || 8.5,
              occupancyRate: parseNumber(hotel.occupancyRate) || 75,
              revpar: parseNumber(hotel.revpar) || 150,
              esgScore: parseInt2(hotel.esgScore) || 80,
              roomCount: parseInt2(hotel.roomCount) || 100,
              starRating: parseInt2(hotel.starRating) || 5,
              status: mapAssetStatus(hotel.status),
              leaseEndDate: hotel.leaseEndDate ? new Date(hotel.leaseEndDate) : new Date('2035-12-31'),
              isSample: hotel.isSample === 'true' || false,
              createdById: hotel.createdById || defaultUserId
            }
          });
          successCount++;
          console.log(` Imported: ${hotel.name}`);
        } catch (err) {
          console.error(` Error importing hotel ${hotel.name}:`, err.message);
        }
      }
      console.log(`\n Successfully imported ${successCount}/${hotels.length} hotels\n`);
    }

    // 3. Import Investments
    const investments = readCSV('Investment_export.csv');
    if (investments) {
      console.log(' Importing Investments...');
      let successCount = 0;

      for (const investment of investments) {
        try {
          // Skip if missing required fields
          if (!investment.user_email || !investment.hotel_asset_id) {
            console.log(` Skipping investment ${investment.id} - missing user_email or hotel_asset_id`);
            continue;
          }

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: investment.user_email }
          });

          if (!user) {
            console.log(` Skipping investment ${investment.id} - user ${investment.user_email} not found`);
            continue;
          }

          // Verify hotel exists
          const hotel = await prisma.hotelAsset.findUnique({
            where: { id: investment.hotel_asset_id }
          });

          if (!hotel) {
            console.log(` Skipping investment ${investment.id} - hotel ${investment.hotel_asset_id} not found`);
            continue;
          }

          await prisma.investment.upsert({
            where: { id: investment.id },
            update: {
              userId: user.id,
              hotelAssetId: investment.hotel_asset_id,
              tokenAmount: parseInt2(investment.token_amount),
              investmentAmount: parseNumber(investment.invested_amount),
              transactionHash: null,
              purchaseDate: investment.created_date ? new Date(investment.created_date) : new Date()
            },
            create: {
              id: investment.id,
              userId: user.id,
              hotelAssetId: investment.hotel_asset_id,
              tokenAmount: parseInt2(investment.token_amount),
              investmentAmount: parseNumber(investment.invested_amount),
              transactionHash: null,
              purchaseDate: investment.created_date ? new Date(investment.created_date) : new Date()
            }
          });
          successCount++;
          console.log(` Imported: ${investment.token_amount} tokens for ${investment.user_email}`);
        } catch (err) {
          console.error(` Error importing investment ${investment.id}:`, err.message);
        }
      }
      console.log(`\n Successfully imported ${successCount}/${investments.length} investments\n`);
    }

    // 4. Import Proposals
    const proposals = readCSV('Proposal_export.csv');
    if (proposals) {
      console.log(' Importing Proposals...');
      let successCount = 0;

      for (const proposal of proposals) {
        try {
          await prisma.proposal.upsert({
            where: { id: proposal.id },
            update: {
              title: proposal.title,
              description: proposal.description || '',
              type: mapProposalType(proposal.type),
              proposerId: defaultUserId,
              hotelAssetId: proposal.hotelAssetId || null,
              status: mapProposalStatus(proposal.status),
              votingStartDate: proposal.votingStartDate ? new Date(proposal.votingStartDate) : null,
              votingEndDate: proposal.votingEndDate ? new Date(proposal.votingEndDate) : null,
              votesFor: parseInt2(proposal.votesFor),
              votesAgainst: parseInt2(proposal.votesAgainst),
              votesAbstain: parseInt2(proposal.votesAbstain),
              quorumRequired: parseInt2(proposal.quorumRequired) || 1000,
              approvalThreshold: parseInt2(proposal.approvalThreshold) || 51,
              executionDetails: proposal.executionDetails || null,
              createdById: proposal.createdById || defaultUserId
            },
            create: {
              id: proposal.id,
              title: proposal.title,
              description: proposal.description || '',
              type: mapProposalType(proposal.type),
              proposerId: defaultUserId,
              hotelAssetId: proposal.hotelAssetId || null,
              status: mapProposalStatus(proposal.status),
              votingStartDate: proposal.votingStartDate ? new Date(proposal.votingStartDate) : null,
              votingEndDate: proposal.votingEndDate ? new Date(proposal.votingEndDate) : null,
              votesFor: parseInt2(proposal.votesFor),
              votesAgainst: parseInt2(proposal.votesAgainst),
              votesAbstain: parseInt2(proposal.votesAbstain),
              quorumRequired: parseInt2(proposal.quorumRequired) || 1000,
              approvalThreshold: parseInt2(proposal.approvalThreshold) || 51,
              executionDetails: proposal.executionDetails || null,
              createdById: defaultUserId
            }
          });
          successCount++;
          console.log(` Imported: ${proposal.title}`);
        } catch (err) {
          console.error(` Error importing proposal ${proposal.id}:`, err.message);
        }
      }
      console.log(`\n Successfully imported ${successCount}/${proposals.length} proposals\n`);
    }

    console.log(' Import completed!\n');

    // Show summary
    const userCount = await prisma.user.count();
    const hotelCount = await prisma.hotelAsset.count();
    const investmentCount = await prisma.investment.count();
    const proposalCount = await prisma.proposal.count();

    console.log(' Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Hotels: ${hotelCount}`);
    console.log(`   Investments: ${investmentCount}`);
    console.log(`   Proposals: ${proposalCount}`);

  } catch (error) {
    console.error(' Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importFromCSV();
