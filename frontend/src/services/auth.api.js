import api from "./api";

const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response;
};

const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    return response;
};

const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const response = await api.post("/auth/logout", { refreshToken });
        return response;
    } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
    }
};

const getMe = async () => {
    const response = await api.get("/auth/me");
    return response;
};

export { login, register, logout, getMe };