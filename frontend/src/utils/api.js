import axios from 'axios';

const api = axios.create({
    baseURL: '/', // Use relative path for proxy

    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
