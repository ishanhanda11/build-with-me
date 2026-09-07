import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh") &&
            !originalRequest.url.includes("/auth/login") &&
            !originalRequest.url.includes("/auth/register")
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const res = await api.post("/auth/refresh", { refreshToken });

                if (res.data?.accessToken) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    if (res.data?.refreshToken) {
                        localStorage.setItem("refreshToken", res.data.refreshToken);
                    }
                    originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userName");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api