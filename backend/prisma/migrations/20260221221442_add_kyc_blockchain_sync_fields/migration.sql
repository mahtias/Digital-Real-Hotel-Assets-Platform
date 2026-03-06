-- AlterTable
ALTER TABLE "hotel_assets" ADD COLUMN     "token_address" TEXT,
ALTER COLUMN "tokenId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "blockchainError" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kyc_blockchain_synced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kyc_blockchain_tx_hash" TEXT,
ADD COLUMN     "kyc_last_verified" TIMESTAMP(3),
ADD COLUMN     "kyc_sync_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kyc_sync_error" TEXT;

-- CreateIndex
CREATE INDEX "users_kyc_blockchain_synced_idx" ON "users"("kyc_blockchain_synced");
