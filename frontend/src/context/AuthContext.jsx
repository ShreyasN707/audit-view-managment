import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); // Start false to avoids blocked UI for now

    // Set default header
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optional: Decode token here to set user role if needed for UI logic
            // For minimal setup, we just assume logged in if token exists
            console.log('Token set in headers');
        } else {
            delete api.defaults.headers.common['Authorization'];
            console.log('Token removed from headers');
        }
    }, [token]);

    const login = async (role, data) => {
        setLoading(true);
        let url = '/api/v1/public/login';
        if (role === 'admin') url = '/api/v1/admin/login';
        if (role === 'accountant') url = '/api/v1/accountant/login';

        console.log('Attempting Login:', url, data);

        try {
            const res = await api.post(url, data);
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            // Decode simple role for UI
            setUser({ role });
            return { success: true };
        } catch (err) {
            console.error('Login Failed:', err);
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        setLoading(true);
        try {
            const res = await api.post('/api/v1/public/register', data);
            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            setUser({ role: 'public' });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
