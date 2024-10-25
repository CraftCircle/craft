-- AlterTable
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'email',
ALTER COLUMN "providerId" DROP NOT NULL;
