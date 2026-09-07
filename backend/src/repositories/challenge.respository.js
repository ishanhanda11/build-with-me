const prisma = require("../db/db");

const getChallenges = (projectId) => {
  return prisma.challenge.findMany({
    where: { projectId },
    orderBy: { challengeOrder: "asc" }
  });
};

const getChallenge = (id, projectId) => {
  return prisma.challenge.findFirst({
    where: {
      id,
      projectId
    }
  });
};

const getChallengeForUser = (challengeId, userId) => {
  return prisma.challenge.findFirst({
    where: {
      id: challengeId,
      project: {
        userId
      }
    }
  });
};

const getLastChallenge = (projectId) => {
  return prisma.challenge.findFirst({
    where: {
      projectId
    },
    orderBy: {
      challengeOrder: 'desc'
    }
  })
}

const getPreviousChallenges = (projectId) => {
  return prisma.challenge.findMany({
    where: {
      projectId,
    },
    orderBy: {
      challengeOrder: "desc"
    },
    take: 2
  });
};
const getPreviousChallenge = (projectId, challengeOrder) => {
  return prisma.challenge.findFirst({
    where: {
      projectId,
      challengeOrder: challengeOrder - 1
    }
  });
};
const getChallengeCount = (projectId) => {
  return prisma.challenge.count({
    where: {
      projectId
    }
  })
}
const getCompletedChallengeCount = (projectId) => {
  return prisma.challenge.count({ where: { projectId, status: 'COMPLETED' } })
}
const updateChallenge = (challengeId, data, tx = prisma) => {
  return tx.challenge.update({
    where: {
      id: challengeId
    },
    data
  });
};

const createChallengeHelp = (data, tx = prisma) => {
  return tx.challengeHelp.create({
    data
  })
}
const getChallengeHelps = (challengeId, userId) => {
  return prisma.challengeHelp.findMany({
    where: {
      attempt: {
        challengeId,
        userId
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
};

const getUserTotalHelpRequests = async (userId) => {
  const count = await prisma.challengeHelp.count({
    where: {
      attempt: {
        userId
      },
      type: {
        in: ["HINT", "PSEUDOCODE", "SOLUTION"]
      }
    }
  });

  const attemptAgg = await prisma.challengeAttempt.aggregate({
    where: { userId },
    _sum: {
      hintsUsed: true,
      pseudocodeUsed: true,
      solutionUsed: true
    }
  });

  const countFromAttempts =
    (attemptAgg._sum?.hintsUsed || 0) +
    (attemptAgg._sum?.pseudocodeUsed || 0) +
    (attemptAgg._sum?.solutionUsed || 0);

  return Math.max(count, countFromAttempts);
};

module.exports = {
  getChallenges,
  getChallenge,
  getChallengeForUser,
  getLastChallenge,
  getPreviousChallenge,
  getPreviousChallenges,
  getChallengeCount,
  getCompletedChallengeCount,
  updateChallenge,
  createChallengeHelp,
  getChallengeHelps,
  getUserTotalHelpRequests
};