-- AlterTable
ALTER TABLE "employer" ADD COLUMN     "identification_number" VARCHAR(255),
ADD COLUMN     "identification_type" INTEGER;

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "identification_number" VARCHAR(255),
ADD COLUMN     "identification_type" INTEGER;
