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
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to shelf');
        }
    };

    const removeFromShelf = async (auditId) => {
        try {
            await api.delete(`/api/v1/public/shelf/${auditId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-12">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Shelf</h2>
                    <span className="bg-brand-100 text-brand-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{shelf.length} Items</span>
                </div>

                {shelf.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No audits in shelf</h3>
                        <p className="mt-1 text-sm text-gray-500">Explore audits below and add them to your shelf.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shelf.map(item => (
                            <div key={item._id} className="card hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-brand-500">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.auditId?.title}</h3>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => removeFromShelf(item.auditId._id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove from Shelf
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Audits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {audits.map(audit => (
                        <div key={audit._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-brand-300 transition-colors">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{audit.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600 mr-2">
                                    {audit.createdBy?.username || 'System'}
                                </span>
                                <span>{new Date(audit.createdAt).toLocaleDateString()}</span>
                            </div>

                            {shelf.some(s => s.auditId?._id === audit._id) ? (
                                <button disabled className="w-full flex justify-center items-center py-2 px-4 rounded-lg bg-green-50 text-green-700 text-sm font-medium cursor-default">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    In Your Shelf
                                </button>
                            ) : (
                                <button
                                    onClick={() => addToShelf(audit._id)}
                                    className="w-full flex justify-center items-center py-2 px-4 rounded-lg border border-brand-600 text-brand-600 hover:bg-brand-50 text-sm font-medium transition-colors"
                                >
                                    Add to Shelf
                                </button>
                            )}
                        </div>
                    ))}
                    {audits.length === 0 && <p className="text-gray-500 col-span-full text-center">No public audits available.</p>}
                </div>
            </section>
        </div>
    );
};

export default PublicDashboard;
