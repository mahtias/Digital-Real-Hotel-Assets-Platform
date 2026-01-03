-- DropIndex
DROP INDEX "hotel_assets_status_idx";

-- AlterTable
ALTER TABLE "hotel_assets" ADD COLUMN     "apy" DOUBLE PRECISION,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "esg_score" INTEGER,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_sample" BOOLEAN,
ADD COLUMN     "lease_end_date" TIMESTAMP(3),
ADD COLUMN     "occupancy_rate" DOUBLE PRECISION,
ADD COLUMN     "revpar" INTEGER,
ADD COLUMN     "room_count" INTEGER,
ADD COLUMN     "star_rating" INTEGER,
ADD COLUMN     "token_price" INTEGER,
ADD COLUMN     "token_symbol" TEXT,
ADD COLUMN     "tokens_sold" INTEGER,
ADD COLUMN     "total_tokens" INTEGER,
ADD COLUMN     "total_value" INTEGER;
