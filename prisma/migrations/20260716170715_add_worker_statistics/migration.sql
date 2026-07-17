-- AlterTable
ALTER TABLE "worker" ADD COLUMN     "failedjobs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jobsprocessed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "successfuljobs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalprocessingtime" INTEGER NOT NULL DEFAULT 0;
