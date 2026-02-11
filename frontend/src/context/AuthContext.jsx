import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        if (token) {
            // Decode token to get user info (or fetch from API)
            // For simplicity, we just decode payload here if possible, or trust token presence.
            // Ideally we call /me endpoint. 
            // But we have minimal endpoints. We can decode the JWT payload.
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Check expiry
                if (payload.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: payload.id, role: payload.role });
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (role, credentials) => {
        let url = '/api/v1/public/login';
        if (role === 'accountant') url = '/api/v1/accountant/login';
        if (role === 'admin') url = '/api/v1/admin/login';

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + url, credentials); // VITE_API_URL needs to be set or proxy
            // Actually we set up Nginx, but locally for dev 'npm run dev' -> proxy to backend?
            // Vite proxy or environmental var. We set VITE_API_URL in docker-compose.
            // For local dev without docker, we might need proxy in vite.config.js

            const { token } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (credentials) => {
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/public/register', credentials);
            const { token } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
