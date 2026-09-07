import api from "./api";

const requestHelp = async (helpType, challengeId) => {
    const response = await api.post(`/challenges/${challengeId}/${helpType}`)
    return response.data
}
const getAllHelpHistory = async (challengeId) => {
    const response = await api.get(`/challenges/${challengeId}/help`)
    return response.data
}
export { requestHelp, getAllHelpHistory }