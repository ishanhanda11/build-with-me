const { createProjectService, getAllProjectService, getProjectByIdService, updateProjectService, deleteProjectService } = require("../services/project.service");

const createProjectController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }
        const project = await createProjectService(userId)
        return res.status(201).json({
            message: "Project generated successfully",
            project
        });

    } catch (err) {
        next(err)
    }
}

const getProjectsController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid User"
            })
        }
        const projects = await getAllProjectService(userId)
        return res.status(200).json({
            message: "Projects fetched successfully",
            projects
        })

    } catch (err) {
        next(err)
    }
}

const getProjectByIdController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                message: "Invalid Project Id"
            })
        }
        const project = await getProjectByIdService(id, userId)
        return res.status(200).json({
            message: "Project fetched successfully",
            project
        })
    } catch (err) {
        next(err)
    }
}

const updateProjectController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                message: "Invalid Project Id"
            })
        }
        const { status } = req.body

        const updatedProject = await updateProjectService(id, status, userId)
        return res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject
        })
    } catch (err) {
        next(err)
    }
}

const deleteProjectController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: "Invalid user"
            })
        }
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                message: "Invalid Project Id"
            })
        }
        const deletedProject = await deleteProjectService(userId, id)
        return res.status(200).json({
            message: deletedProject.message,

        })
    } catch (err) {
        next(err)
    }
}
module.exports = { createProjectController, getProjectsController, getProjectByIdController, updateProjectController, deleteProjectController }