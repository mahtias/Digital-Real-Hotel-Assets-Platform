-- CreateEnum
CREATE TYPE "ESGRewardStatus" AS ENUM ('pending', 'verified', 'claimed');

-- CreateEnum
CREATE TYPE "ESGActionType" AS ENUM ('ac_off', 'towel_reuse', 'no_cleaning', 'water_saving', 'recycling');

-- CreateTable
CREATE TABLE "ESGReward" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "reward_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ESGReward_pkey" PRIMARY KEY ("id")
);
