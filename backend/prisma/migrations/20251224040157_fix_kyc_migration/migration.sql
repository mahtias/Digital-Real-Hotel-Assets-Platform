/*
  Warnings:

  - You are about to drop the column `block_number` on the `investments` table. All the data in the column will be lost.
  - You are about to drop the column `gas_price` on the `investments` table. All the data in the column will be lost.
  - You are about to drop the column `gas_used` on the `investments` table. All the data in the column will be lost.
  - You are about to drop the column `investment_amount` on the `investments` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_date` on the `investments` table. All the data in the column will be lost.
  - You are about to drop the column `token_amount` on the `investments` table. All the data in the column will be lost.
  - Added the required column `amount` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens` to the `investments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "investments_transaction_hash_key";

-- AlterTable
ALTER TABLE "investments" DROP COLUMN "block_number",
DROP COLUMN "gas_price",
DROP COLUMN "gas_used",
DROP COLUMN "investment_amount",
DROP COLUMN "purchase_date",
DROP COLUMN "token_amount",
ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "tokens" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "KycStatus_old";
