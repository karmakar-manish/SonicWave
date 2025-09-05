/*
  Warnings:

  - You are about to drop the column `public_id` on the `SongSchema` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SongSchema" DROP COLUMN "public_id",
ADD COLUMN     "audio_public_id" TEXT DEFAULT '',
ADD COLUMN     "img_public_id" TEXT DEFAULT '';
