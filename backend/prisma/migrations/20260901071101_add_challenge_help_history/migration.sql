-- CreateEnum
CREATE TYPE "HelpType" AS ENUM ('HINT', 'PSEUDOCODE', 'SOLUTION');

-- CreateTable
CREATE TABLE "ChallengeHelp" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "type" "HelpType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeHelp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChallengeHelp" ADD CONSTRAINT "ChallengeHelp_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ChallengeAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
