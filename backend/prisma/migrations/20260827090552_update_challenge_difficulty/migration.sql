/*
  Warnings:

  - The `difficulty` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "ChallengeDifficulty" NOT NULL DEFAULT 'MEDIUM';
