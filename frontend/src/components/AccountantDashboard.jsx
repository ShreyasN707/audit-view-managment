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
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-white border-2 border-brand-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-brand-500 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Create New Audit</h2>
                </div>
                <form onSubmit={handleCreate} className="flex gap-3">
                    <input
                        type="text"
                        value={newAuditTitle}
                        onChange={(e) => setNewAuditTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your audit..."
                        required
                        className="input-field flex-grow"
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap px-6 py-2.5 shadow-brand-500/20">
                        Create Audit
                    </button>
                </form>
            </div>

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Audit Records</h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{audits.length} Records</span>
                </div>

                <div className="grid gap-4">
                    {audits.map(audit => (
                        <div key={audit._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:border-brand-300 transition-all group">
                            {editingId === audit._id ? (
                                <div className="flex-grow flex flex-col md:flex-row gap-3 w-full bg-gray-50 p-2 rounded-lg border border-brand-200">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="input-field flex-grow bg-white"
                                        autoFocus
                                        placeholder="Audit title"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(audit._id)} className="btn-primary py-2 px-4 text-sm flex-1 md:flex-none justify-center">Save Changes</button>
                                        <button onClick={() => setEditingId(null)} className="btn-secondary py-2 px-4 text-sm flex-1 md:flex-none justify-center">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start md:items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-lg text-gray-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-700 transition-colors">{audit.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Created on {new Date(audit.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => startEdit(audit)}
                                        className="text-gray-400 hover:text-brand-600 font-medium text-sm p-2 rounded-lg hover:bg-brand-50 transition-colors self-end md:self-center"
                                        title="Edit Audit"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                    {audits.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-500 mb-2">You haven't created any audits yet.</p>
                            <p className="text-sm text-gray-400">Use the form above to add your first record.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AccountantDashboard;
