const { getChallengeForUser, getChallengeHelps } = require("../repositories/challenge.respository")

const getChallengeHelpService = async(challengeId,userId)=>{
    const challenge = getChallengeForUser(challengeId,userId)
    if(!challenge){
        const err = new Error('Challenge with this ID does not exist.')
        err.statusCode = 404
        throw err
    }
    const result = await getChallengeHelps(challengeId,userId)
    return result
}

module.exports = {getChallengeHelpService}