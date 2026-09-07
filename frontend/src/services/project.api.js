import api from "./api";

const createProject = async (profile) => {
    const response = await api.post('/project', profile)
    return response.data;
}
const getProjectById = async (projectId) => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
};

const getProjects = async () => {
    const response = await api.get("/project")
    return response.data;
}
const getChallenges = async (projectId) => {
    const response = await api.get(`/project/${projectId}/challenges`)
    return response.data;
}

const getChallenge = async (projectId, challengeId) => {
    const response = await api.get(`/project/${projectId}/challenges/${challengeId}`)
    return response.data;
}

const submitSolution = async (challengeId, solution) => {
    const response = await api.post(
        `/challenges/${challengeId}/submit`,
        { solution }
    );

    return response.data;
}

const generateAdaptiveChallenges = async (projectId) => {
    const response = await api.post(`/challenges/${projectId}/adaptive`);
    return response.data;
}

const abandonProject = async (projectId) => {
    const response = await api.patch(`/project/${projectId}/status`, { status: "ABANDONED" });
    return response.data;
};

export {
    createProject,
    getProjectById,
    getProjects,
    getChallenges,
    getChallenge,
    submitSolution,
    generateAdaptiveChallenges,
    abandonProject
};