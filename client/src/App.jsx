/**
 * Main Application
 * Da Lat SmartRoute
 * 
 * Tourism-focused design with vibrant colors
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
    const [currentTemperature, setCurrentTemperature] = useState(18);
    const [recommendations, setRecommendations] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const handleWeatherChange = useCallback((condition) => {
        setWeatherCondition(condition);
    }, []);

    const handleTemperatureChange = useCallback((temp) => {
        setCurrentTemperature(temp);
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
        return allPlaces.filter(p => !recIds.has(p.id)).slice(0, 8);
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
        <div className="min-h-screen">
            {/* Enhanced Header with Tourism Vibe */}
            <header className="bg-white shadow-lg sticky top-0 z-40 border-b-4 border-primary-400">
                <div className="tourism-header">
                    <div className="section py-3">
                        <div className="flex items-center justify-between">
                            {/* Logo & Brand */}
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform">
                                    <img src="/dalat-icon.svg" alt="Logo" className="w-full h-full" />
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-xl flex items-center gap-2">
                                        Da Lat SmartRoute
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>
                                    </h1>
                                    <p className="text-white/80 text-xs">Khám phá Đà Lạt thông minh</p>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-6">
                                <Link to="/" className="text-white hover:text-primary-100 font-medium transition-colors">
                                    Trang chủ
                                </Link>
                                <a href="#weather" className="text-white hover:text-primary-100 font-medium transition-colors">
                                    Thời tiết
                                </a>
                                <a href="#places" className="text-white hover:text-primary-100 font-medium transition-colors">
                                    Địa điểm
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="section py-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm địa điểm du lịch..."
                                className="input py-3 pl-12 text-sm w-full"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="section py-8">
                {/* Search Results */}
                {searchQuery && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Kết quả tìm kiếm
                        </h2>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {searchResults.map(place => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-slate-500">Không tìm thấy địa điểm phù hợp</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Main Layout - Weather + Recommendations */}
                {!searchQuery && (
                    <>
                        {/* LARGER Weather Section */}
                        <section id="weather" className="mb-10">
                            <div className="grid md:grid-cols-5 gap-6 items-center">
                                {/* Weather Widget - Takes 3 columns */}
                                <div className="md:col-span-3">
                                    <WeatherWidget
                                        onWeatherChange={handleWeatherChange}
                                        onTemperatureChange={handleTemperatureChange}
                                    />
                                </div>

                                {/* Welcome Message - Takes 2 columns */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-400 to-nature-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        <span>✨</span> AI Powered
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                        Khám phá
                                        <span className="font-display text-primary-500"> Đà Lạt</span>
                                    </h1>
                                    <p className="text-slate-600 leading-relaxed">
                                        Gợi ý địa điểm dựa trên thời tiết thực và AI, giúp bạn có trải nghiệm du lịch tuyệt vời nhất!
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="badge bg-primary-100 text-primary-700">
                                            {allPlaces.length} địa điểm
                                        </span>
                                        <span className="badge bg-nature-100 text-nature-700">
                                            Cập nhật realtime
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Weather-based Recommendations */}
                        <section id="places" className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <span className="text-3xl">🎯</span>
                                        Phù hợp với thời tiết
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">Gợi ý dựa trên AI và điều kiện thời tiết hiện tại</p>
                                </div>
                                <span className="badge bg-sky-100 text-sky-700 text-sm">
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
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                            <span className="text-3xl">💚</span>
                                            Có thể bạn quan tâm
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1">Các địa điểm hot khác tại Đà Lạt</p>
                                    </div>
                                </div>
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

            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-16">
                <div className="section py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/dalat-icon.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1.5" />
                                <span className="font-bold text-lg">Da Lat SmartRoute</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Hệ thống gợi ý du lịch thông minh sử dụng AI, giúp bạn khám phá Đà Lạt một cách tuyệt vời nhất.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#weather" className="text-slate-400 hover:text-primary-400 transition-colors">Thời tiết</a></li>
                                <li><a href="#places" className="text-slate-400 hover:text-primary-400 transition-colors">Địa điểm</a></li>
                                <li><Link to="/" className="text-slate-400 hover:text-primary-400 transition-colors">Trang chủ</Link></li>
                            </ul>
                        </div>

                        {/* Danh mục */}
                        <div>
                            <h3 className="font-semibold mb-4">Danh mục</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="text-slate-400">☕ Quán cafe</li>
                                <li className="text-slate-400">💧 Thác nước</li>
                                <li className="text-slate-400">🏔️ Ngắm cảnh</li>
                                <li className="text-slate-400">🍽️ Nhà hàng</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-semibold mb-4">Liên hệ</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-center gap-2">
                                    <span>📍</span> Đà Lạt, Lâm Đồng
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>📧</span> info@smartroute.vn
                                </li>
                                <li className="flex items-center gap-2">
                                    <span>📱</span> 0263 123 4567
                                </li>
                            </ul>
                            {/* Social Media */}
                            <div className="flex gap-3 mt-4">
                                <a href="#" className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                                    <span className="text-xs">f</span>
                                </a>
                                <a href="#" className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                                    <span className="text-xs">ig</span>
                                </a>
                                <a href="#" className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                                    <span className="text-xs">yt</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                        <p className="text-slate-400 text-sm">
                            © 2024 Da Lat SmartRoute. Made with 💚 in Da Lat
                        </p>
                    </div>
                </div>
            </footer>

            {/* Chatbot */}
            <Chatbot
                currentWeather={weatherCondition}
                currentTemperature={currentTemperature}
            />
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
