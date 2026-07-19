/*
  Warnings:

  - You are about to drop the column `errormesage` on the `deadletterrecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deadletterrecord" DROP COLUMN "errormesage",
ADD COLUMN     "errormessage" TEXT;
