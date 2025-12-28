/*
  Warnings:

  - The values [UNDER_REVIEW] on the enum `KycStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `id_document` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `id_number` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `id_type` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `proof_of_address` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `selfie_document` on the `kyc` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `kyc` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contract_address]` on the table `hotel_assets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_hash]` on the table `kyc` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockchain_tx_hash]` on the table `kyc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document_number` to the `kyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `kyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `kyc` table without a default value. This is not possible if the table is not empty.
  - Made the column `state` on table `kyc` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'FULL');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'RESIDENCE_PERMIT');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "KycStatus_new" AS ENUM ('NOT_STARTED', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED');
ALTER TABLE "kyc" ALTER COLUMN "status" DROP DEFAULT;
DROP TYPE IF EXISTS "KycStatus_old";
ALTER TYPE "KycStatus" RENAME TO "KycStatus_old";
ALTER TABLE "users" ALTER COLUMN "kyc_status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "kyc_status" TYPE "KycStatus_new" USING ("kyc_status"::text::"KycStatus_new");
ALTER TYPE "KycStatus_new" RENAME TO "KycStatus";

ALTER TABLE "users" ALTER COLUMN "kyc_status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- DropIndex
DROP INDEX "kyc_status_idx";

-- AlterTable
ALTER TABLE "hotel_assets" ADD COLUMN     "contract_address" TEXT,
ADD COLUMN     "deployment_tx_hash" TEXT,
ADD COLUMN     "required_kyc_level" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "block_number" BIGINT,
ADD COLUMN     "gas_price" DECIMAL(30,0),
ADD COLUMN     "gas_used" BIGINT,
ADD COLUMN     "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "kyc" DROP COLUMN "address",
DROP COLUMN "id_document",
DROP COLUMN "id_number",
DROP COLUMN "id_type",
DROP COLUMN "proof_of_address",
DROP COLUMN "selfie_document",
DROP COLUMN "status",
ADD COLUMN     "address_proof" TEXT,
ADD COLUMN     "blockchain_approved_at" TIMESTAMP(3),
ADD COLUMN     "blockchain_submitted_at" TIMESTAMP(3),
ADD COLUMN     "blockchain_tx_hash" TEXT,
ADD COLUMN     "document_back" TEXT,
ADD COLUMN     "document_front" TEXT,
ADD COLUMN     "document_hash" TEXT,
ADD COLUMN     "document_number" TEXT NOT NULL,
ADD COLUMN     "document_type" "DocumentType" NOT NULL,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "on_chain_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "selfie_image" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "submission_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "verification_level" "VerificationLevel",
ADD COLUMN     "wallet_address" TEXT,
ALTER COLUMN "state" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kyc_expires_at" TIMESTAMP(3),
ADD COLUMN     "verification_level" "VerificationLevel",
ALTER COLUMN "kyc_status" SET DEFAULT 'NOT_STARTED';

-- CreateIndex
CREATE UNIQUE INDEX "hotel_assets_contract_address_key" ON "hotel_assets"("contract_address");

-- CreateIndex
CREATE INDEX "hotel_assets_contract_address_idx" ON "hotel_assets"("contract_address");

-- CreateIndex
CREATE INDEX "investments_status_idx" ON "investments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_document_hash_key" ON "kyc"("document_hash");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_blockchain_tx_hash_key" ON "kyc"("blockchain_tx_hash");

-- CreateIndex
CREATE INDEX "kyc_wallet_address_idx" ON "kyc"("wallet_address");

-- CreateIndex
CREATE INDEX "kyc_document_hash_idx" ON "kyc"("document_hash");

-- CreateIndex
CREATE INDEX "kyc_verification_level_idx" ON "kyc"("verification_level");

-- CreateIndex
CREATE INDEX "users_kyc_status_idx" ON "users"("kyc_status");

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
