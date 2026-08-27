const { getChallengeForUser, updateChallenge } = require("../repositories/challenge.respository");
const { createAttempt, getInProgressAttempt } = require("../repositories/challengeAttempt.repository");
const { generateEvaluation } = require("./ai.service");
const { updateAttemptService } = require("./challengeAttempt.service");

const submitAttemptService = async(challengeId,userId,solution)=>{
    const challenge = await getChallengeForUser(challengeId,userId)
    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    if(challenge.status === 'COMPLETED'){
        const err = new Error("Challenge already completed, you cannot submit again.");
        err.statusCode = 400;
        throw err;
    }
    
    let attempt = await getInProgressAttempt(challengeId,userId)
    if(!attempt){
        attempt = await createAttempt({challengeId,userId})
    }
    
    const response = await generateEvaluation(challenge,solution)
    const status = response.logicCorrectness
  ? "COMPLETED"
  : "FAILED";
    const updatedAttempt = await updateAttemptService(attempt.id,userId,{ status });
    if (response.logicCorrectness) {
        await updateChallenge(challengeId, {
        status: "COMPLETED"
    });
}
    return {
        evaluation: response,
        attempt: updatedAttempt
    };
}

module.exports = {submitAttemptService}