-- CreateTable
CREATE TABLE "UserSchema" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_clerkId_key" ON "UserSchema"("clerkId");
