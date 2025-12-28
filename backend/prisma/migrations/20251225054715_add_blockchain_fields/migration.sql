-- AlterTable
ALTER TABLE "kyc" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "blockchainTx" TEXT,
ADD COLUMN     "blockchainVerifier" TEXT,
ADD COLUMN     "documentHash" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3);
