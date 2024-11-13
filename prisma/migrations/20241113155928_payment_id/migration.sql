/*
  Warnings:

  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "payment" DROP CONSTRAINT "payment_pkey",
ALTER COLUMN "payment_id" DROP DEFAULT,
ALTER COLUMN "payment_id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id");
DROP SEQUENCE "payment_payment_id_seq";
