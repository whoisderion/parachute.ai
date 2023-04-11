/*
  Warnings:

  - Added the required column `analysisId` to the `Recording` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcriptId` to the `Recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recording" ADD COLUMN     "analysisId" TEXT NOT NULL,
ADD COLUMN     "transcriptId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
