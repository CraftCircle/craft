-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('InApp', 'Email', 'Push');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Sent', 'Read', 'Unread');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('General', 'Transaction', 'Post', 'Ticket', 'Product');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'InApp',
    "status" "NotificationStatus" NOT NULL DEFAULT 'Unread',
    "category" "NotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "externalError" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
