/*
  Warnings:

  - Added the required column `address` to the `kyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_number` to the `kyc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `kyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "KycStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "kyc" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "document_number" TEXT NOT NULL,
ADD COLUMN     "document_type" TEXT NOT NULL;
