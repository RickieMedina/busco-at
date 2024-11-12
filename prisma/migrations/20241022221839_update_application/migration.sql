/*
  Warnings:

  - The `application_status` column on the `application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('aceptada', 'rechazada', 'pendiente', 'cancelada');

-- AlterTable
ALTER TABLE "application" DROP COLUMN "application_status",
ADD COLUMN     "application_status" "Status" NOT NULL DEFAULT 'pendiente';
