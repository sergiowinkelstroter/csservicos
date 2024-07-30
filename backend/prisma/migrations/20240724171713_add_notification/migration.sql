/*
  Warnings:

  - You are about to drop the `UserNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserNotifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotification" DROP CONSTRAINT "UserNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserNotifications" DROP CONSTRAINT "_UserNotifications_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserNotifications" DROP CONSTRAINT "_UserNotifications_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notification" TEXT NOT NULL DEFAULT 'I';

-- DropTable
DROP TABLE "UserNotification";

-- DropTable
DROP TABLE "_UserNotifications";

-- DropTable
DROP TABLE "notifications";
