import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: 'public',
        email: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const payload = {
            password: formData.password
        };
        if (formData.role === 'public') payload.email = formData.email;
        else payload.username = formData.username;

        const res = await login(formData.role, payload);
        if (res.success) {
            if (formData.role === 'admin') navigate('/admin');
            else if (formData.role === 'accountant') navigate('/accountant');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <select name="role" value={formData.role} onChange={handleChange} style={{ padding: '0.5rem' }}>
                    <option value="public">Public User</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Admin</option>
                </select>

                {formData.role === 'public' ? (
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                ) : (
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                )}

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.5rem' }}
                />

                <button type="submit" style={{ padding: '0.5rem', background: 'blue', color: 'white' }}>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register (Public)</Link></p>
        </div>
    );
}
