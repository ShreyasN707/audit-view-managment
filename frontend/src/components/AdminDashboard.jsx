import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('accountants');

    const [audits, setAudits] = useState([]);
    const [logs, setLogs] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchAudits = async () => {
        try {
            const res = await api.get('/api/v1/admin/audits');
            setAudits(res.data.data);
        } catch (error) {
            console.error("Failed to fetch audits", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/api/v1/admin/logs');
            setLogs(res.data.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'audits') fetchAudits();
        if (activeTab === 'logs') fetchLogs();
    }, [activeTab]);

    const createAccountant = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/admin/accountants', { username, password });
            alert('Accountant Created');
            setUsername('');
            setPassword('');
        } catch (error) {
            alert('Error creating accountant');
        }
    };

    const deleteAudit = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/api/v1/admin/audits/${id}`);
            fetchAudits();
        } catch (error) {
            alert('Error deleting audit');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 border-b border-gray-200 pb-1">
                {['accountants', 'audits', 'logs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm transition-colors duration-200 rounded-t-lg ${activeTab === tab
                                ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'accountants' && (
                <div className="card max-w-lg mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Create Accountant</h3>
                    <form onSubmit={createAccountant} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full shadow-lg shadow-brand-500/30">
                            Create Account
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'audits' && (
                <div className="grid gap-4">
                    {audits.map(audit => (
                        <div key={audit._id} className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md ${!audit.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div>
                                <h3 className="font-bold text-gray-900">{audit.title} {!audit.isActive && <span className="text-xs text-red-500 font-normal ml-2">(Deleted)</span>}</h3>
                                <p className="text-sm text-gray-500 mt-1">By: <span className="font-medium text-gray-700">{audit.createdBy?.username || 'Unknown'}</span></p>
                            </div>
                            {audit.isActive && (
                                <button onClick={() => deleteAudit(audit._id)} className="btn-danger text-sm py-1.5 px-3">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {audits.length === 0 && <p className="text-center text-gray-500 py-8">No audits found.</p>}
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-[#1e1e1e] rounded-xl shadow-xl overflow-hidden border border-gray-800">
                    <div className="bg-[#252526] p-3 border-b border-[#333] flex justify-between items-center px-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="font-mono text-xs text-gray-400 ml-3">system.log</span>
                        </div>
                    </div>
                    <pre className="overflow-y-auto max-h-[500px] p-4 font-mono text-xs text-green-400 bg-[#1e1e1e] whitespace-pre-wrap leading-relaxed tracking-wide custom-scrollbar">
                        {logs || "No logs found."}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
