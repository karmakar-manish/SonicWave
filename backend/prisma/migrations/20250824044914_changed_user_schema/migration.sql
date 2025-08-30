/*
  Warnings:

  - You are about to drop the column `clerkId` on the `UserSchema` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserSchema` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `UserSchema` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `releaseYear` to the `AlbumSchema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `UserSchema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `UserSchema` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."UserSchema_clerkId_key";

-- AlterTable
ALTER TABLE "public"."AlbumSchema" ADD COLUMN     "releaseYear" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserSchema" DROP COLUMN "clerkId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_email_key" ON "public"."UserSchema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_uid_key" ON "public"."UserSchema"("uid");
