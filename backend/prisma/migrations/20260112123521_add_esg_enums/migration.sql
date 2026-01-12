/*
  Warnings:

  - You are about to drop the `ESGReward` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ESGReward";

-- CreateTable
CREATE TABLE "EsgReward" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "action_type" "ESGActionType" NOT NULL,
    "reward_amount" DOUBLE PRECISION NOT NULL,
    "status" "ESGRewardStatus" NOT NULL DEFAULT 'pending',
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EsgReward_pkey" PRIMARY KEY ("id")
);
