-- CreateTable
CREATE TABLE "PesapalIPN" (
    "id" TEXT NOT NULL,
    "ipnId" TEXT NOT NULL,
    "ipnUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PesapalIPN_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PesapalIPN_ipnId_key" ON "PesapalIPN"("ipnId");
