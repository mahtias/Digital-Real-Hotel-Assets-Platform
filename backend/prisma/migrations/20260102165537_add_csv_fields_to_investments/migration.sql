/*
  Warnings:

  - Added the required column `earned_rewards` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invested_amount` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending_rewards` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staked_amount` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_amount` to the `investments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "created_by_id" TEXT,
ADD COLUMN     "earned_rewards" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "invested_amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "is_sample" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pending_rewards" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "staked_amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "token_amount" INTEGER NOT NULL;
