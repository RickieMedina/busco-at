/*
  Warnings:

  - You are about to drop the column `perfil_completed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "perfil_completed",
ADD COLUMN     "profile_completed" BOOLEAN DEFAULT false;
