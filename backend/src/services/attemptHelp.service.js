const prisma = require('../db/db')
const { getChallengeForUser, updateChallenge, createChallengeHelp } = require("../repositories/challenge.respository");
const { getInProgressAttempt, createAttempt, updateAttempt } = require("../repositories/challengeAttempt.repository");
const { generateHint, generatePseudocode, generateSolution } = require("./ai.service");

const requestHintService = async (challengeId,userId) =>{
    const challenge = await getChallengeForUser(challengeId,userId)
    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    if(challenge.status === 'COMPLETED'){
        const err = new Error("Challenge already completed, cannot request hint.");
        err.statusCode = 400;
        throw err;
    }
    const hint = await generateHint(challenge)
    
    let attempt = await getInProgressAttempt(challengeId, userId);

    if (!attempt) {
        attempt = await createAttempt({
            challengeId,
            userId
        });
    }
    const result = await prisma.$transaction(async(tx)=>{
        const updatedAttempt = await updateAttempt(
            attempt.id,
            {
                hintsUsed: attempt.hintsUsed + 1
            },
            tx
        )

        await createChallengeHelp({
            attemptId: attempt.id,
            type: "HINT",
            content: hint
        }, tx)

        return updatedAttempt
    })
    return {
        hint,
        attempt: result
    };
}

const requestPseudocodeService = async (challengeId,userId) =>{
    const challenge = await getChallengeForUser(challengeId,userId)
    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    if(challenge.status === 'COMPLETED'){
        const err = new Error("Challenge already completed, cannot request pseudocode.");
        err.statusCode = 400;
        throw err;
    }
    const pseudocode = await generatePseudocode(challenge)
    let attempt = await getInProgressAttempt(
        challengeId,
        userId
    );

    if (!attempt) {
        attempt = await createAttempt({
            challengeId,
            userId
        });
    }
    const result = await prisma.$transaction(async(tx)=>{
        const updatedAttempt = await updateAttempt(
            attempt.id,
            {
                pseudocodeUsed: attempt.pseudocodeUsed + 1
            },
            tx
        )

        await createChallengeHelp({
            attemptId: attempt.id,
            type: "PSEUDOCODE",
            content: pseudocode
        }, tx)
        return updatedAttempt
    })
    return {
        pseudocode: pseudocode,
        attempt: result
    }
}

const requestSolutionService = async (challengeId, userId)=>{
    const challenge = await getChallengeForUser(challengeId,userId)
    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    if(challenge.status === 'COMPLETED'){
        const err = new Error("Challenge already completed, cannot request solution.");
        err.statusCode = 400;
        throw err;
    }
    const solution = await generateSolution(challenge)
    let attempt = await getInProgressAttempt(
        challengeId,
        userId
    );
    if (!attempt) {
        attempt = await createAttempt({
            challengeId,
            userId
        });
    }
    const result = await prisma.$transaction(async (tx) => {

        const updatedAttempt = await updateAttempt(
            attempt.id,
            {
                status: "COMPLETED",
                solutionUsed: attempt.solutionUsed + 1
            },
            tx
        )

        await createChallengeHelp({
            attemptId: attempt.id,
            type: "SOLUTION",
            content: solution
        }, tx)

        await updateChallenge(
            challengeId,
            { status: "COMPLETED" },
            tx
        )

        return updatedAttempt
    })

    return {
        solution,
        attempt: result
    }
    
    
}

module.exports = {requestHintService,requestPseudocodeService,requestSolutionService}