import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('accountants');
    const [audits, setAudits] = useState([]);
    const [logs, setLogs] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchAudits = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/v1/admin/audits');
            setAudits(res.data.data);
        } catch (error) {
            console.error("Failed to fetch audits", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/v1/admin/logs');
            setLogs(res.data.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setIsLoading(false);
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
            alert('Accountant Created successfully');
            setUsername('');
            setPassword('');
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating accountant');
        }
    };

    const deleteAudit = async (id) => {
        if (!window.confirm('Are you sure you want to delete this audit?')) return;
        try {
            await api.delete(`/api/v1/admin/audits/${id}`);
            fetchAudits();
        } catch (error) {
            alert('Error deleting audit');
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {['accountants', 'audits', 'logs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'accountants' && (
                    <div className="card max-w-lg">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-brand-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Create New Accountant</h3>
                        </div>

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
                            <button type="submit" className="btn-primary w-full shadow-lg shadow-brand-500/20 mt-2">
                                Create Account
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'audits' && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-white h-20 rounded-xl border border-gray-100"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {audits.map(audit => (
                                    <div key={audit._id} className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md hover:border-brand-200/50 ${!audit.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-2 rounded-lg ${audit.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{audit.title} {!audit.isActive && <span className="text-xs text-white bg-red-500 rounded px-2 py-0.5 ml-2">Deleted</span>}</h3>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600 mr-2">
                                                        {audit.createdBy?.username || 'Unknown'}
                                                    </span>
                                                    ID: <span className="font-mono text-xs text-gray-400 ml-1">{audit._id.slice(-6)}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {audit.isActive && (
                                            <button onClick={() => deleteAudit(audit._id)} className="btn-danger text-sm py-2 px-4 flex items-center shadow-red-500/20 hover:shadow-red-500/30">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {audits.length === 0 && <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">No audits found in the system.</div>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-800 ring-1 ring-black/5">
                        <div className="bg-[#252526] p-3 border-b border-[#333] flex justify-between items-center px-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                                </div>
                                <span className="font-mono text-xs text-gray-400 ml-2 border-l border-gray-600 pl-3">system.log — bash — 80x24</span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                                {isLoading ? 'Fetching...' : 'Live'}
                            </div>
                        </div>
                        <pre className="overflow-y-auto max-h-[500px] p-4 font-mono text-xs leading-relaxed tracking-wide custom-scrollbar text-gray-300">
                            {logs ? (
                                logs.split('\n').map((line, i) => {
                                    if (line.includes('[INFO]')) return <span key={i} className="text-blue-400 block">{line}</span>;
                                    if (line.includes('[WARN]')) return <span key={i} className="text-yellow-400 block">{line}</span>;
                                    if (line.includes('[ERROR]')) return <span key={i} className="text-red-400 block">{line}</span>;
                                    return <span key={i} className="block">{line}</span>;
                                })
                            ) : (
                                <span className="text-gray-500 italic">No logs found.</span>
                            )}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
