-- DropForeignKey
ALTER TABLE "Recording" DROP CONSTRAINT "Recording_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "Recording" DROP CONSTRAINT "Recording_transcriptId_fkey";

-- AlterTable
ALTER TABLE "Recording" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "analysisId" DROP NOT NULL,
ALTER COLUMN "transcriptId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE SET NULL ON UPDATE CASCADE;
