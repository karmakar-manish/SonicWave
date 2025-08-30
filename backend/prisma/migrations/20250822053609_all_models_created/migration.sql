-- CreateTable
CREATE TABLE "public"."SongSchema" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "albumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlbumSchema" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlbumSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageSchema" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageSchema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SongSchema" ADD CONSTRAINT "SongSchema_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."AlbumSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
