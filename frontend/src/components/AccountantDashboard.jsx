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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded shadow border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Create New Audit</h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input
                        type="text"
                        value={newAuditTitle}
                        onChange={(e) => setNewAuditTitle(e.target.value)}
                        placeholder="Audit Title"
                        required
                        className="flex-grow border border-gray-300 rounded px-3 py-2"
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create</button>
                </form>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">My Audits</h2>
                <div className="grid gap-4">
                    {audits.map(audit => (
                        <div key={audit._id} className="bg-white p-4 rounded shadow border border-gray-200 flex justify-between items-center">
                            {editingId === audit._id ? (
                                <div className="flex-grow flex gap-4 mr-4">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="flex-grow border border-gray-300 rounded px-2"
                                    />
                                    <button onClick={() => handleUpdate(audit._id)} className="text-green-600 hover:text-green-800">Save</button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{audit.title}</h3>
                                    <p className="text-sm text-gray-500">Created: {new Date(audit.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}

                            {editingId !== audit._id && (
                                <button onClick={() => startEdit(audit)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AccountantDashboard;
