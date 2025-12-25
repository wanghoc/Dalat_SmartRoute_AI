/**
 * PlaceDetailPage Component
 * Da Lat SmartRoute
 * 
 * Full detail page for a single location
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PlaceDetailPage = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [relatedPlaces, setRelatedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/places');
                const data = await response.json();

                if (data.success) {
                    const found = data.data.places.find(p => p.id === parseInt(id));
                    setPlace(found);

                    // Get related places (same type)
                    if (found) {
                        const related = data.data.places
                            .filter(p => p.type === found.type && p.id !== found.id)
                            .slice(0, 4);
                        setRelatedPlaces(related);
                    }
                }
            } catch (error) {
                console.error('Error fetching place:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Không tìm thấy địa điểm</h2>
                <Link to="/" className="btn-primary">Về trang chủ</Link>
            </div>
        );
    }

    const getDirectionsUrl = () => {
        return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    };

    const getMapUrl = () => {
        return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="section py-4 flex items-center gap-4">
                    <Link
                        to="/"
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="font-semibold text-slate-800 truncate">{place.name}</h1>
                </div>
            </header>

            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
                <img
                    src={place.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="section py-6">
                <div className="bg-white rounded-2xl shadow-soft -mt-16 relative z-10 overflow-hidden">
                    <div className="p-6">
                        {/* Title */}
                        <div className="mb-6">
                            <span className="badge bg-primary-100 text-primary-700 mb-2">{place.type}</span>
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">{place.name}</h1>
                            {place.name_vi && place.name_vi !== place.name && (
                                <p className="text-slate-500">{place.name_vi}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Giới thiệu</h3>
                            <p className="text-slate-700 leading-relaxed">{place.description}</p>
                            {place.description_vi && (
                                <p className="text-slate-600 mt-2 text-sm">{place.description_vi}</p>
                            )}
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Giờ mở cửa</p>
                                <p className="font-medium text-slate-700">
                                    {place.opening_hours?.start === '00:00' && place.opening_hours?.end === '23:59'
                                        ? '24/7'
                                        : `${place.opening_hours?.start} - ${place.opening_hours?.end}`}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-500 mb-1">Giá vé</p>
                                <p className="font-medium text-slate-700">{place.price_range || 'Miễn phí'}</p>
                            </div>
                        </div>

                        {/* Address */}
                        {place.address && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Địa chỉ</h3>
                                <p className="text-slate-700">{place.address}</p>
                            </div>
                        )}

                        {/* Contact */}
                        {place.phone && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Liên hệ</h3>
                                <a href={`tel:${place.phone}`} className="text-primary-600 hover:underline">
                                    {place.phone}
                                </a>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <a
                                href={getDirectionsUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1"
                            >
                                Chỉ đường
                            </a>
                            <a
                                href={getMapUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                Xem bản đồ
                            </a>
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="h-64 border-t border-slate-100">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1000!2d${place.lng}!3d${place.lat}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${place.lat}!5e0!3m2!1svi!2s!4v1`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Map"
                        />
                    </div>
                </div>

                {/* Related Places */}
                {relatedPlaces.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Địa điểm tương tự</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedPlaces.map(p => (
                                <Link
                                    key={p.id}
                                    to={`/place/${p.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all"
                                >
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-24 object-cover"
                                    />
                                    <div className="p-3">
                                        <h4 className="text-sm font-medium text-slate-700 line-clamp-1">{p.name}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceDetailPage;
