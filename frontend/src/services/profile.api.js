import api from "./api";

const createProfile = async (profile) => {
    return await api.post('/profile', profile)
}

const getProfile = async () => {
    return api.get("/profile");
};

const updateProfile = async (profile) => {
    return api.patch("/profile", profile);
};

export { createProfile, getProfile, updateProfile };