/*
  Warnings:

  - Added the required column `image` to the `TicketType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "image" TEXT NOT NULL;
