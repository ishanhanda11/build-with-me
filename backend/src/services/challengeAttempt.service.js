
const { getChallengeForUser } = require('../repositories/challenge.respository')
const { createAttempt, getAttempt,getAllAttempts, updateAttempt } = require('../repositories/challengeAttempt.repository')

const createAttemptService = async (challengeId, userId) => {
    const challenge = await getChallengeForUser(challengeId,userId)
     if (!challenge) {
        const err = new Error("Challenge not found for user");
        err.statusCode = 404;
        throw err;
    }
    const attempt = await createAttempt({ challengeId, userId })
    return attempt
}

const getAttemptService = async (attemptId, userId) => {
    const attempt = await getAttempt(attemptId, userId)
    if (!attempt) {
        const err = new Error('Attempt not found')
        err.statusCode = 404
        throw err
    }
    return attempt
}
const getAllAttemptsService = async (challengeId, userId) => {
    const attempts = await getAllAttempts(challengeId, userId)
    return attempts
}
const updateAttemptService = async (attemptId, userId, data) => {
    const attempt = await getAttempt(attemptId, userId)
    if (!attempt) {
        const err = new Error('Attempt not found')
        err.statusCode = 404
        throw err
    }
    const updatedAttempt = await updateAttempt(attemptId, data)
    return updatedAttempt
}

module.exports = {
    createAttemptService,
    getAttemptService,
    getAllAttemptsService,
    updateAttemptService
}