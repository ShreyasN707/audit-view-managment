import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register'; // We'll create this next
import Dashboard from './pages/Dashboard'; // We'll create this next


// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Or 403 page
    }

    return children;
};

function AppRoutes() {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Public Routes (Authenticated) */}
                <Route path="/" element={
                    <ProtectedRoute roles={['public', 'accountant', 'admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Accountant Routes (Explicit) */}
                <Route path="/accountant" element={
                    <ProtectedRoute roles={['accountant']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Admin Routes (Explicit) */}
                <Route path="/admin" element={
                    <ProtectedRoute roles={['admin']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />

            </Routes>
        </Layout>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
