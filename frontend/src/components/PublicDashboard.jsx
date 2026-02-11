import { useState, useEffect } from 'react';
import api from '../utils/api';

const PublicDashboard = () => {
    const [audits, setAudits] = useState([]);
    const [shelf, setShelf] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [auditsRes, shelfRes] = await Promise.all([
                api.get('/api/v1/public/audits'),
                api.get('/api/v1/public/shelf')
            ]);
            setAudits(auditsRes.data.data);
            setShelf(shelfRes.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addToShelf = async (auditId) => {
        try {
            await api.post(`/api/v1/public/shelf/${auditId}`);
            fetchData(); // Refresh
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to shelf');
        }
    };

    const removeFromShelf = async (auditId) => {
        try {
            await api.delete(`/api/v1/public/shelf/${auditId}`);
            fetchData(); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold mb-4">My Shelf</h2>
                {shelf.length === 0 ? <p className="text-gray-500">Your shelf is empty.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                        {shelf.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded shadow border border-gray-200">
                                <h3 className="font-bold text-lg">{item.auditId?.title}</h3>
                                <p className="text-sm text-gray-500">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                                <button onClick={() => removeFromShelf(item.auditId._id)} className="mt-2 text-red-600 hover:text-red-800 text-sm">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">All Audits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {audits.map(audit => (
                        <div key={audit._id} className="bg-white p-4 rounded shadow border border-gray-200">
                            <h3 className="font-bold text-lg">{audit.title}</h3>
                            <p className="text-sm text-gray-500">By: {audit.createdBy?.username}</p>
                            <p className="text-xs text-gray-400">{new Date(audit.createdAt).toLocaleDateString()}</p>

                            {/* Check if already in shelf */}
                            {shelf.some(s => s.auditId?._id === audit._id) ? (
                                <span className="mt-2 inline-block text-green-600 text-sm">In Shelf</span>
                            ) : (
                                <button onClick={() => addToShelf(audit._id)} className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm">Add to Shelf</button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PublicDashboard;
