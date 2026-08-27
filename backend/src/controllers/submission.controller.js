const { submitAttemptService } = require("../services/submitAttempt.service")

const attemptSubmissionController = async (req,res,next)=>{
    try{
    const userId = req.user.userId
    if(!userId){
        return res.status(401).json({message: "userId does not exist"})
    }
    const attemptId = req.params.attemptId
    if(!attemptId){
        return res.status(400).json({message: "invalid attemptId"})
    }
    const { solution } = req.body;
    const response = await submitAttemptService(attemptId,userId,solution)
    res.status(200).json({
        message: "solution submitted successfully",
        response
    })
}catch(err){
    next(err)
}
}

module.exports = {attemptSubmissionController}