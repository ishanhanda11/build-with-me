const { createProfile, getProfile, updateProfile } = require("../services/profile.service")

const createProfileController = async (req,res,next) =>{
    try{
        const userId = req.user.userId
        if(!userId){
            return res.status(401).json({message: "Invalid user"})
        }
        const result = await createProfile(req.body,userId)
        return res.status(201).json({
            messsage: result.message,
            profile: result.profile
        })
    }catch(err){
        next(err)
    }
}

const getProfileController = async (req,res,next)=>{
    try{
        const userId = req.user.userId
        if(!userId){
            return res.status(401).json({message: "Invalid user"})
        }
        const result = await getProfile(userId)
        return res.status(200).json({
            messsage: result.message,
            profile: result.profile
        })
    }catch(err){
        next(err)
    }
}

const updateProfileController = async (req,res,next) =>{
    try{
        const userId = req.user.userId
        if(!userId){
            return res.status(401).json({message: "Invalid user"})
        }
        const result = await updateProfile(userId,req.body)
        return res.status(200).json({
            message: result.message,
            profile: result.profile
        })
    }catch(err){
        next(err)
    }
}
module.exports = {createProfileController, getProfileController, updateProfileController}