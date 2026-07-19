-- AlterTable
ALTER TABLE "queue" ADD COLUMN     "defaultpriority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "isratelimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxjobsperminute" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "maxretries" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "pollinterval" INTEGER NOT NULL DEFAULT 10000;
