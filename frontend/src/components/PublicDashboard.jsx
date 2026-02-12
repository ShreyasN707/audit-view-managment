import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PublicDashboard = () => {
    const { logout } = useAuth();
    const [audits, setAudits] = useState([]);
    const [shelf, setShelf] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Parallel fetch
            const [auditsRes, shelfRes] = await Promise.all([
                api.get('/api/v1/public/audits'),
                api.get('/api/v1/public/shelf')
            ]);

            // Validate response data structure
            const auditData = auditsRes.data?.data || [];
            const shelfData = shelfRes.data?.data || [];

            setAudits(auditData);
            setShelf(shelfData);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setError("Failed to load dashboard data. Please check your connection or login again.");
            if (err.response?.status === 401) {
                logout(); // Force logout on auth failure
            }
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
            // Optimistic update or refresh
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add to shelf');
        }
    };

    const removeFromShelf = async (auditId) => {
        try {
            await api.delete(`/api/v1/public/shelf/${auditId}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <p className="text-gray-500">Loading your dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-center max-w-md">
                <p className="font-bold">Error Loading Data</p>
                <p className="text-sm">{error}</p>
            </div>
            <button onClick={fetchData} className="btn-primary text-sm">Retry</button>
        </div>
    );

    return (
        <div className="space-y-12 animate-fadeIn pb-12">
            {/* Shelf Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">My Shelf</h2>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">{shelf.length} Items</span>
                </div>

                {shelf.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your shelf is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Bookmark audits to read them later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shelf.map(item => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">{item.auditId?.title || 'Untitled Audit'}</h3>
                                    <p className="text-xs text-brand-600 font-medium bg-brand-50 inline-block px-2 py-1 rounded-md mb-4">
                                        Saved on {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => removeFromShelf(item.auditId?._id)}
                                        className="w-full mt-2 btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Audits Section */}
            <section>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-brand-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Latest Audits</h2>
                </div>

                {audits.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg">No public audits available right now.</p>
                        <p className="text-gray-400 text-sm mt-1">Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {audits.map(audit => (
                            <div key={audit._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-brand-300 transition-all hover:shadow-md flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{audit.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            {audit.createdBy?.username || 'System'}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(audit.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {shelf.some(s => s.auditId?._id === audit._id) ? (
                                    <button disabled className="w-full flex justify-center items-center py-2 px-4 rounded-lg bg-green-50 text-green-700 text-sm font-medium cursor-default border border-green-100 opacity-80">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Saved to Shelf
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToShelf(audit._id)}
                                        className="w-full flex justify-center items-center py-2 px-4 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 text-sm font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add to Shelf
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default PublicDashboard;
