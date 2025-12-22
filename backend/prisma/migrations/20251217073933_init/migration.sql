-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'PROPERTY_MANAGER', 'COMPLIANCE_OFFICER', 'FINANCE_MANAGER');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'SOLD_OUT', 'CLOSED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'APPROVED', 'REJECTED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('RENOVATION', 'EXPANSION', 'POLICY_CHANGE', 'DIVIDEND_DISTRIBUTION', 'OTHER');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('FOR', 'AGAINST', 'ABSTAIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kyc_submitted_at" TIMESTAMP(3),
    "kyc_approved_at" TIMESTAMP(3),
    "wallet_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "id_document" TEXT NOT NULL,
    "proof_of_address" TEXT NOT NULL,
    "selfie_document" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "total_value" DECIMAL(15,2) NOT NULL,
    "token_symbol" TEXT NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "tokens_sold" INTEGER NOT NULL DEFAULT 0,
    "token_price" DECIMAL(10,2) NOT NULL,
    "apy" DECIMAL(5,2) NOT NULL,
    "occupancy_rate" DECIMAL(5,2) NOT NULL,
    "revpar" DECIMAL(10,2) NOT NULL,
    "esg_score" INTEGER NOT NULL,
    "room_count" INTEGER NOT NULL,
    "star_rating" INTEGER NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPCOMING',
    "lease_end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "is_sample" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "hotel_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_asset_id" TEXT NOT NULL,
    "token_amount" INTEGER NOT NULL,
    "investment_amount" DECIMAL(15,2) NOT NULL,
    "transaction_hash" TEXT,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_asset_id" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "room_type" TEXT NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "special_requests" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL,
    "proposer_id" TEXT NOT NULL,
    "hotel_asset_id" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "voting_start_date" TIMESTAMP(3),
    "voting_end_date" TIMESTAMP(3),
    "votes_for" INTEGER NOT NULL DEFAULT 0,
    "votes_against" INTEGER NOT NULL DEFAULT 0,
    "votes_abstain" INTEGER NOT NULL DEFAULT 0,
    "quorum_required" INTEGER NOT NULL,
    "approval_threshold" INTEGER NOT NULL,
    "execution_details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "choice" "VoteChoice" NOT NULL,
    "voting_power" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_wallet_address_idx" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_user_id_key" ON "kyc"("user_id");

-- CreateIndex
CREATE INDEX "kyc_user_id_idx" ON "kyc"("user_id");

-- CreateIndex
CREATE INDEX "kyc_status_idx" ON "kyc"("status");

-- CreateIndex
CREATE INDEX "hotel_assets_status_idx" ON "hotel_assets"("status");

-- CreateIndex
CREATE INDEX "hotel_assets_created_by_id_idx" ON "hotel_assets"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "investments_transaction_hash_key" ON "investments"("transaction_hash");

-- CreateIndex
CREATE INDEX "investments_user_id_idx" ON "investments"("user_id");

-- CreateIndex
CREATE INDEX "investments_hotel_asset_id_idx" ON "investments"("hotel_asset_id");

-- CreateIndex
CREATE INDEX "investments_transaction_hash_idx" ON "investments"("transaction_hash");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_hotel_asset_id_idx" ON "bookings"("hotel_asset_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "proposals_proposer_id_idx" ON "proposals"("proposer_id");

-- CreateIndex
CREATE INDEX "proposals_hotel_asset_id_idx" ON "proposals"("hotel_asset_id");

-- CreateIndex
CREATE INDEX "proposals_status_idx" ON "proposals"("status");

-- CreateIndex
CREATE INDEX "votes_proposal_id_idx" ON "votes"("proposal_id");

-- CreateIndex
CREATE INDEX "votes_user_id_idx" ON "votes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_proposal_id_user_id_key" ON "votes"("proposal_id", "user_id");

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_assets" ADD CONSTRAINT "hotel_assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_hotel_asset_id_fkey" FOREIGN KEY ("hotel_asset_id") REFERENCES "hotel_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_asset_id_fkey" FOREIGN KEY ("hotel_asset_id") REFERENCES "hotel_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_proposer_id_fkey" FOREIGN KEY ("proposer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_hotel_asset_id_fkey" FOREIGN KEY ("hotel_asset_id") REFERENCES "hotel_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
