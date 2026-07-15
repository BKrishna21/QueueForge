/*
  Warnings:

  - A unique constraint covering the columns `[currentjobid]` on the table `worker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "worker_currentjobid_key" ON "worker"("currentjobid");
