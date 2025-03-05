/*
  Warnings:

  - A unique constraint covering the columns `[pesapalOrderId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pesapalOrderId_key" ON "Transaction"("pesapalOrderId");
