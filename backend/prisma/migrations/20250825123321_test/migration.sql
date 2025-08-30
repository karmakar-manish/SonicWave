-- DropForeignKey
ALTER TABLE "public"."SongSchema" DROP CONSTRAINT "SongSchema_albumId_fkey";

-- AlterTable
ALTER TABLE "public"."AlbumSchema" ALTER COLUMN "imageUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "public"."SongSchema" ALTER COLUMN "imageUrl" SET DEFAULT '',
ALTER COLUMN "albumId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SongSchema" ADD CONSTRAINT "SongSchema_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."AlbumSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
