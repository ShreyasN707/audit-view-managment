import { useAuth } from '../context/AuthContext';
import PublicDashboard from '../components/PublicDashboard';
import AccountantDashboard from '../components/AccountantDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Access Denied</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            {user.role === 'public' && <PublicDashboard />}
            {user.role === 'accountant' && <AccountantDashboard />}
            {user.role === 'admin' && <AdminDashboard />}
        </div>
    );
};

export default Dashboard;
