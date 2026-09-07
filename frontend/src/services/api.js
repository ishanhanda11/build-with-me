import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        if (
            error.response?.status === 401 &&
            !error.config.url.includes("/auth/refresh") &&
            !error.config.url.includes("/auth/login") &&
            !error.config.url.includes("/auth/register")
        ) {
            try {
                await api.post("/auth/refresh");

                return api(error.config);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default api