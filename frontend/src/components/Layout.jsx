import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl text-indigo-600">
                                AuditSys
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-gray-700">Hello, {user.role}</span>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-500 hover:text-gray-700">Login</Link>
                                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
