-- AlterTable
ALTER TABLE "job" ADD COLUMN     "errormesage" TEXT;

-- CreateTable
CREATE TABLE "deadletterrecord" (
    "id" TEXT NOT NULL,
    "jobid" TEXT NOT NULL,
    "failedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failedbyworker" TEXT,
    "errormesage" TEXT,

    CONSTRAINT "deadletterrecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deadletterrecord_jobid_key" ON "deadletterrecord"("jobid");

-- AddForeignKey
ALTER TABLE "deadletterrecord" ADD CONSTRAINT "deadletterrecord_jobid_fkey" FOREIGN KEY ("jobid") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
