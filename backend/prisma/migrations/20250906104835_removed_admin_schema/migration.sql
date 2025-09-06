/*
  Warnings:

  - You are about to drop the `AdminSchema` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserSchema" ADD COLUMN     "isAdmin" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "public"."AdminSchema";
