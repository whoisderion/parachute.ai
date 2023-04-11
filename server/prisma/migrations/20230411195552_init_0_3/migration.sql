/*
  Warnings:

  - The primary key for the `Recording` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `cloudinaryID` was added to the `Recording` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Recording" DROP CONSTRAINT "Recording_pkey",
ADD COLUMN     "cloudinaryID" TEXT NOT NULL,
ADD CONSTRAINT "Recording_pkey" PRIMARY KEY ("cloudinaryID");
