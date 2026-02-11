import { useState, useEffect } from 'react';
import api from '../utils/api';

const AccountantDashboard = () => {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAuditTitle, setNewAuditTitle] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const fetchAudits = async () => {
        try {
            const res = await api.get('/api/v1/accountant/audits');
            setAudits(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAudits();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/accountant/audits', { title: newAuditTitle });
            setNewAuditTitle('');
            fetchAudits();
        } catch (error) {
            alert('Error creating audit');
        }
    };

    const startEdit = (audit) => {
        setEditingId(audit._id);
        setEditTitle(audit.title);
    };

    const handleUpdate = async (id) => {
        try {
            await api.patch(`/api/v1/accountant/audits/${id}`, { title: editTitle });
            setEditingId(null);
            fetchAudits();
        } catch (error) {
            alert('Error updating audit');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="card bg-brand-50 border-brand-100">
                <h2 className="text-xl font-bold text-brand-900 mb-4">Create New Audit</h2>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        type="text"
                        value={newAuditTitle}
                        onChange={(e) => setNewAuditTitle(e.target.value)}
                        placeholder="Enter audit title..."
                        required
                        className="input-field flex-grow"
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap px-6">
                        Create Audit
                    </button>
                </form>
            </div>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Audits</h2>
                    <span className="text-gray-500 text-sm">{audits.length} Records</span>
                </div>

                <div className="grid gap-4">
                    {audits.map(audit => (
                        <div key={audit._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-brand-200 transition-all">
                            {editingId === audit._id ? (
                                <div className="flex-grow flex flex-col sm:flex-row gap-3 w-full">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="input-field flex-grow"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(audit._id)} className="btn-primary py-2 px-4 text-sm">Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{audit.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Created: {new Date(audit.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button onClick={() => startEdit(audit)} className="text-brand-600 hover:text-brand-800 font-medium text-sm px-3 py-1 rounded hover:bg-brand-50 transition-colors self-start sm:self-center">
                                        Edit Title
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                    {audits.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-gray-500">You haven't created any audits yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AccountantDashboard;
