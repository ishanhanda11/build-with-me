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

const getAllProject = (userId) => {
  return prisma.project.findMany({ where: { userId } })
}

const getProjectById = (id, userId) => {
  return prisma.project.findFirst({ where: { id, userId } })
}

const updateProject = (id, status, userId) => {
  return prisma.project.update({ where: { id, userId }, data: { status } })
}

const deleteProject = (id, userId) => {
  return prisma.project.delete({ where: { id, userId } })
}
module.exports = { createProject, createChallenge, getAllProject, getProjectById, updateProject, deleteProject }