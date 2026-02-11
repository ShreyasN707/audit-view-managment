import axios from 'axios';

// Direct connection to backend
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Debug Request
api.interceptors.request.use(request => {
    console.log('[API Request]', request.method, request.url, request.data);
    return request;
});

// Debug Response
api.interceptors.response.use(
    response => {
        console.log('[API Response]', response.status, response.data);
        return response;
    },
    error => {
        console.error('[API Error]', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
