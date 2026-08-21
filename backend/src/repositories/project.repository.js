const prisma = require('../db/db')

const createProject = (projectData, tx = prisma) => {
  return tx.project.create({
    data: projectData
  });
};

const createChallenge = (challengeData, tx = prisma) => {
  return tx.challenge.create({
    data: challengeData
  });
};

const getAllProject = (userId)=>{
    return prisma.project.findMany({where:{userId}})
}
module.exports = {createProject,createChallenge,getAllProject}