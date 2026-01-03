-- CreateEnum
CREATE TYPE "StakingStatus" AS ENUM ('ACTIVE', 'UNSTAKED', 'REWARDED', 'CLOSED');

-- CreateTable
CREATE TABLE "staking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "staked_amount" DOUBLE PRECISION NOT NULL,
    "lock_period_days" INTEGER NOT NULL,
    "stake_start_date" TIMESTAMP(3) NOT NULL,
    "stake_end_date" TIMESTAMP(3) NOT NULL,
    "apy_rate" DOUBLE PRECISION NOT NULL,
    "earned_rewards" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "claimed_rewards" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "voting_power_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "status" "StakingStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "is_sample" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "staking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staking_user_id_idx" ON "staking"("user_id");

-- CreateIndex
CREATE INDEX "staking_status_idx" ON "staking"("status");

-- AddForeignKey
ALTER TABLE "staking" ADD CONSTRAINT "staking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staking" ADD CONSTRAINT "staking_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
