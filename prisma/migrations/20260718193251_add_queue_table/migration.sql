/*
  Warnings:

  - Added the required column `queueid` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "queueid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "queue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "queue_name_key" ON "queue"("name");

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_queueid_fkey" FOREIGN KEY ("queueid") REFERENCES "queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
