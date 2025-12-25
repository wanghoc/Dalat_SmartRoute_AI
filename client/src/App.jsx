/**
 * Main Application
 * Da Lat SmartRoute
 * 
 * Clean, modern tourism recommendation app with:
 * - Weather-based recommendations
 * - "You might like" section
 * - Detail pages via React Router
 */

import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import WeatherWidget from './components/WeatherWidget';
import PlaceCard from './components/PlaceCard';
import Chatbot from './components/Chatbot';
import PlaceDetailPage from './pages/PlaceDetailPage';

/**
 * Home Page Component
 */
function HomePage() {
    const [weatherCondition, setWeatherCondition] = useState('cloudy');
    const [recommendations, setRecommendations] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const handleWeatherChange = useCallback((condition) => {
        setWeatherCondition(condition);
    }, []);

    // Fetch recommendations based on weather
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/recommendations?condition=${weatherCondition}`);
                const data = await response.json();
                if (data.success) {
                    setRecommendations(data.data.places);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [weatherCondition]);

    // Fetch all places
    useEffect(() => {
        const fetchAllPlaces = async () => {
            try {
                const response = await fetch('/api/places');
                const data = await response.json();
                if (data.success) {
                    setAllPlaces(data.data.places);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchAllPlaces();
    }, []);

    // Filter by search
    const getFilteredPlaces = () => {
        if (!searchQuery) return [];
        const query = searchQuery.toLowerCase();
        return allPlaces.filter(place =>
            place.name.toLowerCase().includes(query) ||
            place.description.toLowerCase().includes(query)
        );
    };

    // Get "You might like" places (not in recommendations)
    const getOtherPlaces = () => {
        const recIds = new Set(recommendations.map(r => r.id));
        return allPlaces.filter(p => !recIds.has(p.id)).slice(0, 6);
    };

    const searchResults = getFilteredPlaces();
    const otherPlaces = getOtherPlaces();

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-44 bg-slate-200" />
                    <div className="p-4 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="section py-4">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/dalat-icon.svg" alt="Logo" className="w-8 h-8" />
                            <span className="font-semibold text-slate-800">Da Lat SmartRoute</span>
                        </Link>

                        {/* Search */}
                        <div className="flex-1 max-w-md ml-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm địa điểm..."
                                    className="input py-2 pl-10 text-sm"
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="section py-6">
                {/* Search Results */}
                {searchQuery && (
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Kết quả tìm kiếm
                        </h2>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {searchResults.map(place => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">
                                Không tìm thấy địa điểm phù hợp
                            </p>
                        )}
                    </section>
                )}

                {/* Main Layout - Weather + Recommendations */}
                {!searchQuery && (
                    <>
                        {/* Weather Section */}
                        <section className="mb-8">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <WeatherWidget onWeatherChange={handleWeatherChange} />
                                </div>
                                <div className="md:col-span-2 flex flex-col justify-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                                        Khám phá Đà Lạt
                                    </h1>
                                    <p className="text-slate-500 mb-4">
                                        Gợi ý địa điểm dựa trên thời tiết và thời gian thực
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="badge bg-primary-100 text-primary-700">AI Recommendation</span>
                                        <span className="badge bg-slate-100 text-slate-600">{allPlaces.length} địa điểm</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Weather-based Recommendations */}
                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Phù hợp với thời tiết
                                </h2>
                                <span className="text-sm text-slate-500">
                                    {recommendations.length} địa điểm
                                </span>
                            </div>

                            {loading ? (
                                <LoadingSkeleton />
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {recommendations.slice(0, 8).map(place => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* You might like */}
                        {otherPlaces.length > 0 && (
                            <section className="mb-8">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Có thể bạn quan tâm
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {otherPlaces.map(place => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 mt-8">
                <div className="section py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/dalat-icon.svg" alt="Logo" className="w-6 h-6" />
                            <span className="text-sm text-slate-600">Da Lat SmartRoute</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            © 2024 - Hệ thống gợi ý du lịch thông minh
                        </p>
                    </div>
                </div>
            </footer>

            {/* Chatbot */}
            <Chatbot currentWeather={weatherCondition} />
        </div>
    );
}

/**
 * Main App with Router
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/place/:id" element={<PlaceDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
