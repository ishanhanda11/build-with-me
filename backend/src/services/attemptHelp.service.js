
const { getChallengeForUser, updateChallenge } = require("../repositories/challenge.respository");
const { getInProgressAttempt, createAttempt } = require("../repositories/challengeAttempt.repository");
const { generateHint, generatePseudocode, generateSolution } = require("./ai.service");
const { updateAttemptService } = require("./challengeAttempt.service")


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
    const updatedAttempt = await updateAttemptService(attempt.id,userId,{hintsUsed: attempt.hintsUsed + 1 })
    return {
        hint,
        attempt: updatedAttempt
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
    const updatedAttempt = await updateAttemptService(attempt.id,userId,{pseudocodeUsed: attempt.pseudocodeUsed + 1})
    return {
        pseudocode: pseudocode,
        attempt: updatedAttempt
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
    const updatedAttempt = await updateAttemptService(attempt.id,userId,{status:'COMPLETED',solutionUsed: attempt.solutionUsed + 1})
    await updateChallenge(challengeId,{status:"COMPLETED"})
    return {
        solution,
        attempt: updatedAttempt
    }
}

module.exports = {requestHintService,requestPseudocodeService,requestSolutionService}