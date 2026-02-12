import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Initial Load Check
    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedRole = localStorage.getItem('userRole');
            const storedName = localStorage.getItem('userName');

            if (storedToken && storedRole) {
                setToken(storedToken);
                setUser({
                    role: storedRole,
                    username: storedName || 'User'
                });
            } else {
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (role, data) => {
        let url = '/api/v1/public/login';
        if (role === 'admin') url = '/api/v1/admin/login';
        if (role === 'accountant') url = '/api/v1/accountant/login';

        try {
            const res = await api.post(url, data);

            // Check response structure: Admin returns 'token', Public returns 'accessToken'
            const newToken = res.data.token || res.data.accessToken;
            const refreshToken = res.data.refreshToken; // Only public users get this (for now)

            if (!newToken) throw new Error('No token received from server');

            // Store in LocalStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('userRole', role);

            const displayName = data.username || data.email || role;
            localStorage.setItem('userName', displayName);

            // Update State
            setToken(newToken);
            setUser({ role, username: displayName });

            return { success: true };
        } catch (err) {
            console.error("Login Failed:", err);
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Login failed'
            };
        }
    };

    const register = async (data) => {
        try {
            const res = await api.post('/api/v1/public/register', data);
            const newToken = res.data.accessToken; // Register returns accessToken

            if (!newToken) throw new Error('No token received');

            localStorage.setItem('token', newToken);
            localStorage.setItem('userRole', 'public');
            localStorage.setItem('userName', data.name);

            setToken(newToken);
            setUser({ role: 'public', username: data.name });

            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.clear(); // Clear everything
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
