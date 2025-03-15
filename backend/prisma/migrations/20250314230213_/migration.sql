/*
  Warnings:

  - You are about to drop the column `codeId` on the `SubPrompt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subPromptId]` on the table `Code` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subPromptId` to the `Code` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubPrompt" DROP CONSTRAINT "SubPrompt_codeId_fkey";

-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "subPromptId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubPrompt" DROP COLUMN "codeId";

-- CreateIndex
CREATE UNIQUE INDEX "Code_subPromptId_key" ON "Code"("subPromptId");

-- AddForeignKey
ALTER TABLE "Code" ADD CONSTRAINT "Code_subPromptId_fkey" FOREIGN KEY ("subPromptId") REFERENCES "SubPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
