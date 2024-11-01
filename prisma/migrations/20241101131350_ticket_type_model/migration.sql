/*
  Warnings:

  - Changed the type of `ticketType` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketTypeEnum" AS ENUM ('GENERAL', 'STUDENT', 'VIP');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "ticketType",
ADD COLUMN     "ticketType" "TicketTypeEnum" NOT NULL;

-- DropEnum
DROP TYPE "TicketType";

-- CreateTable
CREATE TABLE "TicketType" (
    "_id" TEXT NOT NULL,
    "ticketType" "TicketTypeEnum" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
