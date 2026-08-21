const { createProjectService } = require("../services/project.service");

const createProjectController = async(req,res,next) =>{
    try{
        const userId = req.user.userId
        if(!userId){
            return res.status(401).json({
            message: "Invalid user"
            });
        }
        const project = await createProjectService(userId)
        return res.status(201).json({
        message: "Project generated successfully",
        project
    });

    }catch(err){
        next(err)
    }
}

module.exports = {createProjectController}