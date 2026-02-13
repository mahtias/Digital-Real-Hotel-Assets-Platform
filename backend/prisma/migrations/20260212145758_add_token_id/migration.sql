/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `hotel_assets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `hotel_assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotel_assets" ADD COLUMN     "tokenId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "hotel_assets_tokenId_key" ON "hotel_assets"("tokenId");
