import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Register relies on context, calls /api/v1/public/register
        const res = await axios.post('/api/v1/public/register', { name, email, password });
        // Wait, Context implementation of register was:
        // const res = await axios.post(..., credentials);
        // But in Context I didn't export 'register' fully working with axios inside?
        // Let's check Context code. 
        // Context: const register = async (credentials) => { ... }
        // So I should use `register` from useAuth.

        // However, I need to pass the right object.
        const response = await register({ name, email, password });

        if (response.success) {
            navigate('/');
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Register (Public)</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
