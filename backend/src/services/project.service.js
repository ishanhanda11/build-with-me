const { getLearnerProfileByUserId } = require('../repositories/profile.repository')
const { createProject, createChallenge, getAllProject, getProjectById, updateProject, deleteProject } = require('../repositories/project.repository');
const {generateProject} = require('./ai.service');
const prisma = require('../db/db')
const createProjectService = async (userId) => {
    const profile = await getLearnerProfileByUserId(userId)
    if (!profile) {
        const err = new Error("Please create your profile first.");
        err.statusCode = 400;
        throw err;
    }
    const previousProjects = await getAllProject(userId)
    const generatedProject = await generateProject(profile,previousProjects)
    const project = await prisma.$transaction(async (tx) => {
        const project = await createProject({
            userId,
            title: generatedProject.title,
            description: generatedProject.description
        }, tx)

        for (const [index, challenge] of generatedProject.challenges.entries()) {
            await createChallenge({
                projectId: project.id,
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                learningObjectives: challenge.learningObjectives,
                challengeOrder: index + 1
            }, tx);
        }
        return project
    })
    return project

}

const getAllProjectService = async (userId) => {
    const projects = await getAllProject(userId)
    if (projects.length === 0) {
        const err = new Error("No projects found for the user");
        err.statusCode = 404;
        throw err;
    }
    return projects
}

const getProjectByIdService = async (id, userId) => {
    const project = await getProjectById(id, userId)
    if (!project) {
        const err = new Error("Project not found for user");
        err.statusCode = 404;
        throw err;
    }
    return project
}

const updateProjectService = async (id, status, userId) => {
    const project = await getProjectById(id, userId)
    if (!project) {
        const err = new Error("Project not found for user");
        err.statusCode = 404;
        throw err;
    }
    if (project.status === 'COMPLETED') {
        const err = new Error("Project is already completed");
        err.statusCode = 400;
        throw err;
    }
    const updatedProject = await updateProject(id, status, userId)
    return updatedProject
}

const deleteProjectService = async (userId, id) => {
    const project = await getProjectByIdService(id, userId)
    const deletedProject = await deleteProject(id, userId)
    return {
        message: "Project deleted successfully"
    }
}

module.exports = { createProjectService, getAllProjectService, getProjectByIdService, updateProjectService, deleteProjectService }