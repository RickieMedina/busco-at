/*
  Warnings:

  - You are about to drop the column `health_care_type` on the `professional` table. All the data in the column will be lost.
  - You are about to drop the column `patient_type` on the `professional` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_health_care_type_fkey";

-- DropForeignKey
ALTER TABLE "professional" DROP CONSTRAINT "professional_patient_type_fkey";

-- AlterTable
ALTER TABLE "professional" DROP COLUMN "health_care_type",
DROP COLUMN "patient_type";
