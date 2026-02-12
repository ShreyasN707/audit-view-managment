import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Restore basic state from localStorage if available
                const storedRole = localStorage.getItem('userRole');
                const storedName = localStorage.getItem('userName');

                if (storedRole) {
                    setUser({
                        role: storedRole,
                        username: storedName // For display purposes
                    });
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (role, data) => {
        let url = '/api/v1/public/login';
        if (role === 'admin') url = '/api/v1/admin/login';
        if (role === 'accountant') url = '/api/v1/accountant/login';

        try {
            const res = await api.post(url, data);
            const newToken = res.data.token;

            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('userRole', role);

            // Try to set a display name if available or use role/username
            const displayName = data.username || data.email || role;
            localStorage.setItem('userName', displayName);

            setUser({ role, username: displayName });

            return { success: true };
        } catch (err) {
            console.error("Login Error:", err);
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (data) => {
        try {
            const res = await api.post('/api/v1/public/register', data);
            const newToken = res.data.token;

            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('userRole', 'public');
            localStorage.setItem('userName', data.name);

            setUser({ role: 'public', username: data.name });

            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
