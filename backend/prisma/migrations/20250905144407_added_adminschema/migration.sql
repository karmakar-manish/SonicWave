-- CreateTable
CREATE TABLE "public"."AdminSchema" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "AdminSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSchema_email_key" ON "public"."AdminSchema"("email");
