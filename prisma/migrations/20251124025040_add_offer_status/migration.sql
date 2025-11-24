-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "job_offer" ADD COLUMN     "status" "OfferStatus" NOT NULL DEFAULT 'ACTIVE';
