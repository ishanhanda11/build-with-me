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

const getLastChallenge = (projectId)=>{
  return prisma.challenge.findFirst({
    where:{
      projectId
    },
    orderBy:{
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

const updateChallenge = (challengeId, data) => {
    return prisma.challenge.update({
        where: {
            id: challengeId
        },
        data
    });
};

module.exports = {
  getChallenges,
  getChallenge,
  getChallengeForUser,
  getLastChallenge,
  getPreviousChallenges,
  updateChallenge
};