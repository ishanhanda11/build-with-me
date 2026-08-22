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

module.exports = {
  getChallenges,
  getChallenge
};