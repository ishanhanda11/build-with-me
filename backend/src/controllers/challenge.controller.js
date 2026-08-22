const { getChallengesService, getChallengeService } = require("../services/challenge.service")

const getChallengesController = async (req,res,next)=>{
    try{
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid user"
            });
            }
        const projectId = req.params.projectId
        if(!projectId){
            return res.status(400).json({message:"project id does not exist"})
        }
        const challenges = await getChallengesService(projectId,userId)
        return res.status(200).json({
            message: "Challenges fetched successfully",
            challenges
            });
    }catch(err){
        next(err)
    }
}

const getChallengeController = async(req,res,next)=>{
    try{
        const userId = req.user.userId
        const projectId = req.params.projectId
        if(!projectId){
            return res.status(400).json({message:"project id does not exist"})
        }
        const id = req.params.id
        if(!id){
            return res.status(400).json({message:"challenge id does not exist"})
        }
        const challenge = await getChallengeService(id,projectId,userId)
        return res.status(200).json({
            message:"challenge fetched successfully",
            challenge
        })
    }catch(err){
        next(err)
    }
}
module.exports = {getChallengesController,getChallengeController}