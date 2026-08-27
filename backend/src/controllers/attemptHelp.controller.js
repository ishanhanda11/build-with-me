const { requestHintService, requestPseudocodeService, requestSolutionService } = require("../services/attemptHelp.service");

const requestHintController = async (req,res,next) =>{
    try{
    const userId = req.user.userId
    if (!userId) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    const challengeId = req.params.challengeId
    if (!challengeId) {
      return res.status(400).json({
        message: "Challenge ID does not exist"
      });
    }
    const response = await requestHintService(challengeId,userId)
    res.status(200).json({message: "Hint generated successfully", hint: response.hint, attempt: response.attempt})
    }catch(err){
        next(err)
}
}

const requestPseudocodeController = async (req,res,next) =>{
    try{
    const userId = req.user.userId
    if (!userId) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    const challengeId = req.params.challengeId
    if (!challengeId) {
      return res.status(400).json({
        message: "Challenge ID does not exist"
      });
    }
    const response = await requestPseudocodeService(challengeId,userId)
    res.status(200).json({message: "Pseudocode generated successfully", pseudocode: response.pseudocode, attempt: response.attempt})
    }catch(err){
        next(err)
}
}

const requestSolutionController = async (req,res,next) =>{
    try{
    const userId = req.user.userId
    if (!userId) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    const challengeId = req.params.challengeId
    if (!challengeId) {
      return res.status(400).json({
        message: "Challenge ID does not exist"
      });
    }
    const response = await requestSolutionService(challengeId,userId)
    res.status(200).json({message: "Solution generated successfully", solution: response.solution, attempt: response.attempt})
    }catch(err){
        next(err)
}
}

module.exports = {requestHintController,requestPseudocodeController,requestSolutionController}