/*
  Warnings:

  - Added the required column `dayOfWeek` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "dayOfWeek" TEXT NOT NULL;
