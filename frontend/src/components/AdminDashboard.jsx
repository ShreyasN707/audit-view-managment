import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('accountants');

    // Data states
    const [audits, setAudits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchAudits = async () => {
        const res = await api.get('/api/v1/admin/audits');
        setAudits(res.data.data);
    };

    const fetchLogs = async () => {
        const res = await api.get('/api/v1/admin/logs');
        setLogs(res.data.data);
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
            <div className="flex space-x-4 border-b border-gray-200 pb-2">
                <button onClick={() => setActiveTab('accountants')} className={`px-4 py-2 ${activeTab === 'accountants' ? 'bg-indigo-100 text-indigo-700 rounded' : 'text-gray-500'}`}>Accountants</button>
                <button onClick={() => setActiveTab('audits')} className={`px-4 py-2 ${activeTab === 'audits' ? 'bg-indigo-100 text-indigo-700 rounded' : 'text-gray-500'}`}>Audits</button>
                <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 ${activeTab === 'logs' ? 'bg-indigo-100 text-indigo-700 rounded' : 'text-gray-500'}`}>System Logs</button>
            </div>

            {activeTab === 'accountants' && (
                <div className="bg-white p-6 rounded shadow border border-gray-200 max-w-lg">
                    <h3 className="font-bold mb-4">Create Accountant</h3>
                    <form onSubmit={createAccountant} className="space-y-4">
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="block w-full border p-2 rounded" required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full border p-2 rounded" required />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded w-full">Create</button>
                    </form>
                </div>
            )}

            {activeTab === 'audits' && (
                <div className="grid gap-4">
                    {audits.map(audit => (
                        <div key={audit._id} className={`bg-white p-4 rounded shadow border border-gray-200 flex justify-between ${!audit.isActive ? 'opacity-50' : ''}`}>
                            <div>
                                <h3 className="font-bold">{audit.title} {!audit.isActive && '(Deleted)'}</h3>
                                <p className="text-sm text-gray-500">By: {audit.createdBy?.username}</p>
                            </div>
                            {audit.isActive && (
                                <button onClick={() => deleteAudit(audit._id)} className="text-red-600 hover:text-red-800">Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-gray-900 text-green-400 p-4 rounded shadow overflow-y-auto max-h-96 font-mono text-sm">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-800 pb-1">
                            <span className="text-gray-500">[{log.timestamp}]</span> <span className="text-yellow-400">{log.level.toUpperCase()}</span>: {log.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
