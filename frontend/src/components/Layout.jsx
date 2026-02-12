import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center space-x-2.5 group">
                                <div className="bg-brand-600 p-1.5 rounded-lg shadow-sm group-hover:bg-brand-700 transition-colors">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-brand-700 transition-colors">AuditSys</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <>
                                    <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span className="font-medium capitalize">{user.role}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-gray-100"
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Log in</Link>
                                    <Link to="/register" className="btn-primary text-sm shadow-md shadow-brand-500/20">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                {children}
            </main>
        </div>
    );
};

export default Layout;
