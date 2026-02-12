import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token & Log
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.headers);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 & Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[API Response Error]', error.response?.status, error.response?.data);

        if (error.response && error.response.status === 401) {
            // Only clear if not on login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
