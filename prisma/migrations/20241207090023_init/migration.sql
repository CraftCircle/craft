/*
  Warnings:

  - Added the required column `image` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "image" TEXT NOT NULL;
