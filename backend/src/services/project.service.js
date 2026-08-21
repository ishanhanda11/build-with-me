const { getLearnerProfileByUserId } = require('../repositories/profile.repository')
const {createProject,createChallenge,getAllProject} = require('../repositories/project.repository');
const generateProject = require('./ai.service');
const prisma = require('../db/db')
const createProjectService = async (userId) =>{
    const profile = await getLearnerProfileByUserId(userId)
    if (!profile) {
    const err = new Error("Please create your profile first.");
    err.statusCode = 400;
    throw err;
}
    const generatedProject = await generateProject(profile)
    const project = await prisma.$transaction(async(tx)=>{
        const project = await createProject({
            userId,
            title: generatedProject.title,
            description: generatedProject.description
        },tx)

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

module.exports = {createProjectService}