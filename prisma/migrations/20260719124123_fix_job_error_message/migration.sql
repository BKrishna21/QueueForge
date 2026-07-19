/*
  Warnings:

  - You are about to drop the column `errormesage` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job" DROP COLUMN "errormesage",
ADD COLUMN     "errormessage" TEXT;
