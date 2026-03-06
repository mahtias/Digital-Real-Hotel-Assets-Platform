/*
  Warnings:

  - A unique constraint covering the columns `[blockchain_id]` on the table `hotel_assets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "hotel_assets" ADD COLUMN     "blockchain_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "hotel_assets_blockchain_id_key" ON "hotel_assets"("blockchain_id");
