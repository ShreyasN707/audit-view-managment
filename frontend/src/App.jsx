import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicDashboard from './components/PublicDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import AdminDashboard from './components/AdminDashboard';

// Simple placeholder layout
const Layout = ({ children }) => (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header style={{ background: '#333', color: '#fff', padding: '1rem' }}>
            <h1>Audit System (Minimal)</h1>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Dashboards - We use the existing components but routable directly for testing */}
                        <Route path="/dashboard" element={<PublicDashboard />} />
                        <Route path="/accountant" element={<AccountantDashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />

                        {/* Redirect root to login */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
