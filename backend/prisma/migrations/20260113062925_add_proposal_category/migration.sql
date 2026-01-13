-- CreateEnum
CREATE TYPE "ProposalCategory" AS ENUM ('asset_acquisition', 'fee_adjustment', 'partnership', 'platform_upgrade', 'esg_initiative');

-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "category" "ProposalCategory";
