import api from "./api";

const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response;
}

const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    return response;
}

export { login, register };