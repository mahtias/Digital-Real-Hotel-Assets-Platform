/*
  Warnings:

  - You are about to drop the column `apy` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `contract_address` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `deployment_tx_hash` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `esg_score` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `is_sample` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `lease_end_date` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `occupancy_rate` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `required_kyc_level` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `revpar` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `room_count` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `star_rating` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `token_price` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `token_symbol` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `tokens_sold` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `total_tokens` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `total_value` on the `hotel_assets` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `investments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `investments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `address_proof` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_approved_at` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_submitted_at` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `blockchain_tx_hash` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `document_back` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `document_front` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `document_hash` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `document_number` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `on_chain_status` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `selfie_image` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `submission_count` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `verification_level` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_address` on the `kyc` table. All the data in the column will be lost.
  - Made the column `created_by_id` on table `hotel_assets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "hotel_assets" DROP CONSTRAINT "hotel_assets_created_by_id_fkey";

-- DropIndex
DROP INDEX "hotel_assets_contract_address_idx";

-- DropIndex
DROP INDEX "hotel_assets_contract_address_key";

-- DropIndex
DROP INDEX "hotel_assets_created_by_id_idx";

-- DropIndex
DROP INDEX "kyc_blockchain_tx_hash_key";

-- DropIndex
DROP INDEX "kyc_document_hash_idx";

-- DropIndex
DROP INDEX "kyc_document_hash_key";

-- DropIndex
DROP INDEX "kyc_user_id_idx";

-- DropIndex
DROP INDEX "kyc_verification_level_idx";

-- DropIndex
DROP INDEX "kyc_wallet_address_idx";

-- AlterTable
ALTER TABLE "hotel_assets" DROP COLUMN "apy",
DROP COLUMN "contract_address",
DROP COLUMN "country",
DROP COLUMN "deployment_tx_hash",
DROP COLUMN "esg_score",
DROP COLUMN "image_url",
DROP COLUMN "is_sample",
DROP COLUMN "lease_end_date",
DROP COLUMN "occupancy_rate",
DROP COLUMN "required_kyc_level",
DROP COLUMN "revpar",
DROP COLUMN "room_count",
DROP COLUMN "star_rating",
DROP COLUMN "token_price",
DROP COLUMN "token_symbol",
DROP COLUMN "tokens_sold",
DROP COLUMN "total_tokens",
DROP COLUMN "total_value",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "created_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "investments" DROP COLUMN "tokens",
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "kyc" DROP COLUMN "address_proof",
DROP COLUMN "blockchain_approved_at",
DROP COLUMN "blockchain_submitted_at",
DROP COLUMN "blockchain_tx_hash",
DROP COLUMN "document_back",
DROP COLUMN "document_front",
DROP COLUMN "document_hash",
DROP COLUMN "document_number",
DROP COLUMN "document_type",
DROP COLUMN "expires_at",
DROP COLUMN "ip_address",
DROP COLUMN "on_chain_status",
DROP COLUMN "phone_number",
DROP COLUMN "selfie_image",
DROP COLUMN "street",
DROP COLUMN "submission_count",
DROP COLUMN "user_agent",
DROP COLUMN "verification_level",
DROP COLUMN "wallet_address";

-- CreateIndex
CREATE INDEX "kyc_reviewed_by_idx" ON "kyc"("reviewed_by");

-- AddForeignKey
ALTER TABLE "hotel_assets" ADD CONSTRAINT "hotel_assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
