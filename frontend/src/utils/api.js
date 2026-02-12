import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If we get a 401, it might mean the token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        }
        return Promise.reject(error);
    }
);

export default api;
