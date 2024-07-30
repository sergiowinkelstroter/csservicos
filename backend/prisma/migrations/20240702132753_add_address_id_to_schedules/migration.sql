/*
  Warnings:

  - You are about to drop the column `address` on the `schedules` table. All the data in the column will be lost.
  - The `status` column on the `schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `adresses` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENTE', 'PRESTADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('A_CONFIRMAR', 'AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "adresses" DROP CONSTRAINT "adresses_userId_fkey";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "address",
ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "providerId" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ScheduleStatus" NOT NULL DEFAULT 'A_CONFIRMAR';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLIENTE',
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "adresses";

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
