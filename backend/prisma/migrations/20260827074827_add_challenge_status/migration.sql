-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "status" "ChallengeStatus" NOT NULL DEFAULT 'IN_PROGRESS';
