-- AlterEnum
ALTER TYPE "InvestmentStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "blockchainStatus" TEXT DEFAULT 'PENDING',
ADD COLUMN     "blockchain_tx_hash" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "walletAddress" TEXT;

-- CreateIndex
CREATE INDEX "investments_blockchainStatus_idx" ON "investments"("blockchainStatus");
