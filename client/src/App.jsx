/**
 * ============================================================
 * MAIN APPLICATION
 * Smart Da Lat Tourism Recommendation System
 * ============================================================
 * 
 * Main React application with:
 * - Header with logo and search
 * - Hero section with Weather Widget
 * - Main content with recommendation cards
 * - Google Maps embed
 * - Floating chatbot
 * - Footer
 * 
 * @author Smart Da Lat Tourism Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import WeatherWidget from './components/WeatherWidget';
import PlaceCard from './components/PlaceCard';
import Chatbot from './components/Chatbot';
import MapEmbed from './components/MapEmbed';

/**
 * Main App Component
 */
function App() {
    // State management
    const [weatherCondition, setWeatherCondition] = useState('cloudy');
    const [recommendations, setRecommendations] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentTime, setCurrentTime] = useState(new Date());

    /**
     * Handle weather condition change from WeatherWidget
     */
    const handleWeatherChange = useCallback((condition) => {
        setWeatherCondition(condition);
    }, []);

    /**
     * Fetch recommendations from API based on weather condition
     */
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
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [weatherCondition]);

    /**
     * Fetch all places for search/filter
     */
    useEffect(() => {
        const fetchAllPlaces = async () => {
            try {
                const response = await fetch('/api/places');
                const data = await response.json();
                if (data.success) {
                    setAllPlaces(data.data.places);
                }
            } catch (error) {
                console.error('Failed to fetch places:', error);
            }
        };

        fetchAllPlaces();
    }, []);

    /**
     * Update current time every minute
     */
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    /**
     * Filter places based on search query and active filter
     */
    const getFilteredPlaces = () => {
        let places = searchQuery ? allPlaces : recommendations;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            places = places.filter(place =>
                place.name.toLowerCase().includes(query) ||
                place.name_vi?.toLowerCase().includes(query) ||
                place.description.toLowerCase().includes(query) ||
                place.type.toLowerCase().includes(query)
            );
        }

        // Apply type filter
        if (activeFilter !== 'all') {
            places = places.filter(place => place.type === activeFilter);
        }

        return places;
    };

    /**
     * Get unique place types for filter buttons
     */
    const getPlaceTypes = () => {
        const types = [...new Set(allPlaces.map(p => p.type))];
        return ['all', ...types];
    };

    /**
     * Get filter button label and emoji
     */
    const getFilterLabel = (type) => {
        const labels = {
            all: '🎯 Tất cả',
            indoor: '🏠 Trong nhà',
            outdoor: '🌳 Ngoài trời',
            cafe: '☕ Cafe',
            waterfall: '💧 Thác nước',
            viewpoint: '🏔️ Ngắm cảnh',
            restaurant: '🍽️ Nhà hàng'
        };
        return labels[type] || type;
    };

    const filteredPlaces = getFilteredPlaces();
    const placeTypes = getPlaceTypes();

    return (
        <div className="min-h-screen">
            {/* ========== HEADER ========== */}
            <header className="glass sticky top-0 z-40 border-b border-white/30">
                <div className="section py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 
                              rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🌸</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Smart Da Lat</h1>
                                <p className="text-xs text-gray-500">Du lịch thông minh</p>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="flex-1 max-w-md hidden sm:block">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm địa điểm..."
                                    className="input pl-11 py-2.5 text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                               hover:text-gray-600 text-lg"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Current time display */}
                        <div className="hidden md:flex items-center gap-2 text-gray-600">
                            <span className="text-lg">🕐</span>
                            <span className="text-sm font-medium">
                                {currentTime.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Mobile search */}
                    <div className="mt-4 sm:hidden">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm địa điểm..."
                                className="input pl-11 py-2.5 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* ========== HERO SECTION ========== */}
            <section className="section pt-8 pb-4">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Weather Widget */}
                    <div className="animate-fade-in">
                        <WeatherWidget onWeatherChange={handleWeatherChange} />
                    </div>

                    {/* Welcome message & info */}
                    <div className="glass rounded-3xl p-8 flex flex-col justify-center animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Khám phá Đà Lạt
                            <span className="gradient-text"> thông minh</span> 🌸
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Hệ thống AI gợi ý địa điểm dựa trên <strong>thời tiết thực</strong> và
                            <strong> giờ mở cửa</strong>. Đảm bảo bạn luôn có trải nghiệm tuyệt vời
                            nhất khi đến Đà Lạt!
                        </p>

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-primary-50 rounded-xl">
                                <p className="text-2xl font-bold text-primary-600">{allPlaces.length}</p>
                                <p className="text-xs text-gray-500">Địa điểm</p>
                            </div>
                            <div className="text-center p-3 bg-secondary-50 rounded-xl">
                                <p className="text-2xl font-bold text-secondary-600">{filteredPlaces.length}</p>
                                <p className="text-xs text-gray-500">Đang mở</p>
                            </div>
                            <div className="text-center p-3 bg-accent-50 rounded-xl">
                                <p className="text-2xl font-bold text-accent-600">
                                    {weatherCondition === 'rainy' ? '🌧️' :
                                        weatherCondition === 'sunny' ? '☀️' :
                                            weatherCondition === 'clear' ? '🌤️' : '⛅'}
                                </p>
                                <p className="text-xs text-gray-500">Thời tiết</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FILTER SECTION ========== */}
            <section className="section py-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {placeTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                         transition-all duration-300 ${activeFilter === type
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                                    : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
                                }`}
                        >
                            {getFilterLabel(type)}
                        </button>
                    ))}
                </div>
            </section>

            {/* ========== MAIN CONTENT - RECOMMENDATIONS ========== */}
            <section className="section py-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {searchQuery
                            ? `🔍 Kết quả tìm kiếm`
                            : `📍 Gợi ý cho bạn`
                        }
                    </h2>
                    <span className="text-sm text-gray-500">
                        {filteredPlaces.length} địa điểm
                    </span>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredPlaces.length === 0 && (
                    <div className="glass rounded-3xl p-12 text-center">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Không tìm thấy địa điểm
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Thử thay đổi từ khóa hoặc bộ lọc để tìm địa điểm phù hợp
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                            className="btn-primary"
                        >
                            Xem tất cả
                        </button>
                    </div>
                )}

                {/* Places grid */}
                {!loading && filteredPlaces.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
                        {filteredPlaces.map((place, index) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                featured={index === 0 && !searchQuery}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ========== MAP SECTION ========== */}
            <section className="section py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    🗺️ Bản đồ Đà Lạt
                </h2>
                <MapEmbed className="h-[400px]" />
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="glass mt-12 border-t border-white/30">
                <div className="section py-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* About */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 
                                rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-xl">🌸</span>
                                </div>
                                <h3 className="text-lg font-bold gradient-text">Smart Da Lat</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Hệ thống gợi ý du lịch thông minh sử dụng AI để đề xuất
                                địa điểm dựa trên thời tiết và thời gian thực.
                            </p>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-4">Liên kết</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="https://www.google.com/maps/place/Da+Lat"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-primary-600 transition-colors">
                                        🗺️ Bản đồ Đà Lạt
                                    </a>
                                </li>
                                <li>
                                    <a href="https://openweathermap.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-primary-600 transition-colors">
                                        🌤️ OpenWeatherMap
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-4">Liên hệ</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>📍 Đà Lạt, Lâm Đồng, Việt Nam</li>
                                <li>📧 info@smartdalat.vn</li>
                                <li>📱 +84 263 123 4567</li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 Smart Da Lat Tourism. Made with 💚 for Da Lat lovers.
                        </p>
                    </div>
                </div>
            </footer>

            {/* ========== CHATBOT ========== */}
            <Chatbot />
        </div>
    );
}

export default App;
