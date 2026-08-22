const {getChallenge,getChallenges} = require('../repositories/challenge.respository')
const { getProjectById } = require('../repositories/project.repository')


const getChallengesService = async(projectId,userId)=>{
    const project = await getProjectById(projectId,userId)
    if(!project){
        const err = new Error("Project not found for user");
        err.statusCode = 404;
        throw err;
    }
    const challenges = await getChallenges(projectId)
    return challenges
}

const getChallengeService = async(id,projectId,userId)=>{
    const project = await getProjectById(projectId,userId)
    if(!project){
        const err = new Error("Project not found for user");
        err.statusCode = 404;
        throw err;
    }
    const challenge = await getChallenge(id,projectId)

    if (!challenge) {
        const err = new Error("Challenge not found");
        err.statusCode = 404;
        throw err;
    }
    return challenge
}

module.exports = {getChallengeService,getChallengesService}