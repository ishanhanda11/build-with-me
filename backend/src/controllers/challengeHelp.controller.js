const { getChallengeHelpService } = require("../services/challenge.help.service")

const challengeHelpController = async(req,res,next)=>{
    try{
    const {userId} = req.user
    if(!userId){
        return res.status(401).json({message:"UserId does not exist."})
    }
    const {challengeId} = req.params
    if(!challengeId){
        return res.status(400).json({message:"challengeId does not exist."})
    }

    const result = await getChallengeHelpService(challengeId,userId)
    res.status(200).json({
        message:"All help requests fetched successfully.",
        result
    })
}catch(err){
    next(err)
}
}

module.exports = {challengeHelpController}