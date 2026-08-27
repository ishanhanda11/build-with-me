const prisma = require('../db/db')

const createAttempt = (attemptData, tx = prisma) => {
    return tx.challengeAttempt.create({ data: attemptData })
}

const getAttempt = (attemptId, userId) => {
    return prisma.challengeAttempt.findFirst({
        where: {
            id: attemptId,
            userId
        }
    })
}
const getAllAttempts = (challengeId, userId) => {
    return prisma.challengeAttempt.findMany({
        where: {
            challengeId,
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    });
};

const getInProgressAttempt = (challengeId,userId)=>{
    return prisma.challengeAttempt.findFirst({where:{
        challengeId,userId,status:'IN_PROGRESS'}
    }
    )
}
const updateAttempt = (attemptId, data) => {
    return prisma.challengeAttempt.update({
        where: { id: attemptId},
        data
    });
}

module.exports = {
    createAttempt,
    getAttempt,
    getAllAttempts,
    getInProgressAttempt,
    updateAttempt
}