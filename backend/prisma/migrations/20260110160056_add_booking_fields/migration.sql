-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "booking_code" TEXT,
ADD COLUMN     "discount_applied" INTEGER,
ADD COLUMN     "payment_method" TEXT;
