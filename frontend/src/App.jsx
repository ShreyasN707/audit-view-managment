import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                } />
                <Route path="/admin" element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                } />
                <Route path="/accountant" element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                } />
                <Route path="/" element={<Login />} />
            </Routes>
        </AuthProvider>
    );
}
