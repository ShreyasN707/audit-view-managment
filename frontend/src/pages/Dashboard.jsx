import { useAuth } from '../context/AuthContext';
import PublicDashboard from '../components/PublicDashboard';
import AccountantDashboard from '../components/AccountantDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="mt-1 text-gray-500">Welcome back, {user.username || user.name || 'User'}</p>
            </div>

            {user.role === 'public' && <PublicDashboard />}
            {user.role === 'accountant' && <AccountantDashboard />}
            {user.role === 'admin' && <AdminDashboard />}
        </div>
    );
};

export default Dashboard;
