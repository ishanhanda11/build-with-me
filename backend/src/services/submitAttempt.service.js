const prisma = require('../db/db')
const { getChallengeForUser, updateChallenge, getChallengeCount, getCompletedChallengeCount, getPreviousChallenge, createChallengeHelp } = require("../repositories/challenge.respository");
const { createAttempt, getInProgressAttempt, updateAttempt } = require("../repositories/challengeAttempt.repository");
const { getProjectById, updateProject } = require("../repositories/project.repository");
const { adaptChallengeService } = require("./adaptiveChallenge.service");
const { generateEvaluation } = require("./ai.service");


const submitAttemptService = async (challengeId, userId, solution) => {
    const challenge = await getChallengeForUser(challengeId, userId)
    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    if (challenge.status === 'COMPLETED') {
        const err = new Error("Challenge already completed, you cannot submit again.");
        err.statusCode = 400;
        throw err;
    }
    const project = await getProjectById(challenge.projectId, userId)

    if (project.status === 'ABANDONED') {
        const err = new Error("Project already abandoned, you cannot submit now.");
        err.statusCode = 400;
        throw err;
    }
    if (project.status === 'COMPLETED') {
        const err = new Error("Project already completed, you cannot submit now.");
        err.statusCode = 400;
        throw err;
    }
    const previousChallenge = await getPreviousChallenge(challenge.projectId, challenge.challengeOrder);
    if (previousChallenge && previousChallenge.status !== "COMPLETED") {
        const err = new Error("Complete the previous challenge first.");
        err.statusCode = 400;
        throw err;
    }
    if (project.status === 'PAUSED') {
        await updateProject(project.id, 'ACTIVE', userId)
    }
    let attempt = await getInProgressAttempt(challengeId, userId)
    if (!attempt) {
        attempt = await createAttempt({ challengeId, userId })
    }
    let response;
    try {
        response = await generateEvaluation(challenge, solution)
    } catch (err) {
        console.error("Gemini evaluation failed:", err);

        const error = new Error("AI evaluation failed. Please try again.");
        error.statusCode = 503;
        throw error;
    }

    const status = response.logicCorrectness
        ? "COMPLETED"
        : "FAILED";
    const result = await prisma.$transaction(async (tx) => {
        const updatedAttempt = await updateAttempt(attempt.id, { status }, tx);
        await createChallengeHelp({
            attemptId: attempt.id,
            type: "USER_SOLUTION",
            content: solution
        }, tx);
        await createChallengeHelp({
            attemptId: attempt.id,
            type: "EVALUATION",
            content: response
        }, tx);
        return updatedAttempt
    })
    let newChallengesGenerated = false;
    if (response.logicCorrectness) {
        await updateChallenge(challengeId, {
            status: "COMPLETED"
        });

        const totalChallenges = await getChallengeCount(challenge.projectId)
        const completedChallenges = await getCompletedChallengeCount(challenge.projectId)
        if (project.maxChallenges === totalChallenges && totalChallenges === completedChallenges) {
            await updateProject(project.id, 'COMPLETED', userId)
        } else {
            try {
                const newChallenges = await adaptChallengeService(userId, challenge.projectId);
                newChallengesGenerated = Array.isArray(newChallenges) && newChallenges.length > 0;
            } catch (error) {
                console.error("Adaptive challenge generation failed after evaluation:", error);
                newChallengesGenerated = false;
            }
        }
    }
    return {
        evaluation: response,
        attempt: result,
        newChallengesGenerated
    };
}

module.exports = { submitAttemptService }