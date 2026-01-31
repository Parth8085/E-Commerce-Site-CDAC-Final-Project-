import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5252/api',
});

api.interceptors.request.use(
    (config) => {
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const tokenKey = isAdminPath ? 'admin_token' : 'user_token';
        const token = localStorage.getItem(tokenKey) || localStorage.getItem('token'); // Fallback for legacy
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
