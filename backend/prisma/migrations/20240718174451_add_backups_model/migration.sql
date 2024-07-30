-- CreateTable
CREATE TABLE "backups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "backups" ADD CONSTRAINT "backups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
