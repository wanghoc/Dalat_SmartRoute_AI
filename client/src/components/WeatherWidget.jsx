/**
 * ============================================================
 * WEATHER WIDGET COMPONENT
 * Smart Da Lat Tourism
 * ============================================================
 * 
 * Displays real-time weather for Da Lat, Vietnam
 * Shows temperature, condition, humidity, and forecast
 * 
 * @component WeatherWidget
 */

import { useState, useEffect } from 'react';

/**
 * Weather icon mapping based on condition
 * @param {string} condition - Weather condition
 * @returns {string} Emoji icon
 */
const getWeatherIcon = (condition) => {
    const icons = {
        sunny: '☀️',
        clear: '🌤️',
        cloudy: '⛅',
        rainy: '🌧️',
        default: '🌡️'
    };
    return icons[condition] || icons.default;
};

/**
 * Background gradient based on weather
 * @param {string} condition - Weather condition
 * @returns {string} Tailwind gradient classes
 */
const getWeatherGradient = (condition) => {
    const gradients = {
        sunny: 'from-yellow-300 via-orange-300 to-amber-400',
        clear: 'from-sky-300 via-blue-300 to-cyan-300',
        cloudy: 'from-gray-300 via-slate-300 to-gray-400',
        rainy: 'from-slate-400 via-gray-400 to-blue-500',
        default: 'from-primary-300 via-primary-400 to-primary-500'
    };
    return gradients[condition] || gradients.default;
};

/**
 * WeatherWidget Component
 * 
 * @param {Object} props
 * @param {Function} props.onWeatherChange - Callback when weather data changes
 */
const WeatherWidget = ({ onWeatherChange }) => {
    // State for weather data
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch weather data from backend API
     */
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/weather');
                const data = await response.json();

                if (data.success) {
                    setWeather(data.data);
                    // Notify parent component of weather condition
                    if (onWeatherChange) {
                        onWeatherChange(data.data.condition);
                    }
                } else {
                    throw new Error(data.error || 'Failed to fetch weather');
                }
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError(err.message);
                // Set default weather for demo
                const defaultWeather = {
                    city: 'Da Lat',
                    country: 'VN',
                    temperature: 18,
                    feels_like: 17,
                    humidity: 85,
                    description: 'Nhiều mây',
                    condition: 'cloudy',
                    forecast: 'Thời tiết tốt cho việc tham quan.',
                    is_mock: true
                };
                setWeather(defaultWeather);
                if (onWeatherChange) {
                    onWeatherChange(defaultWeather.condition);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        // Refresh weather every 10 minutes
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [onWeatherChange]);

    // Loading state
    if (loading) {
        return (
            <div className="glass rounded-3xl p-8 animate-pulse">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state (still show default data)
    if (!weather) {
        return (
            <div className="glass rounded-3xl p-8 text-center">
                <p className="text-red-500">⚠️ Unable to load weather data</p>
                <p className="text-gray-500 text-sm mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getWeatherGradient(weather.condition)} p-8 shadow-xl`}>
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
                {/* Header with location */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                            📍 {weather.city}, {weather.country}
                        </h2>
                        <p className="text-white/80 text-sm">
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    {weather.is_mock && (
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                            Demo Data
                        </span>
                    )}
                </div>

                {/* Main weather display */}
                <div className="flex items-center gap-6 mb-6">
                    {/* Weather icon */}
                    <div className="text-7xl animate-float drop-shadow-lg">
                        {getWeatherIcon(weather.condition)}
                    </div>

                    {/* Temperature */}
                    <div>
                        <div className="text-white text-6xl font-bold drop-shadow-md">
                            {weather.temperature}°C
                        </div>
                        <p className="text-white/90 text-lg capitalize">
                            {weather.description}
                        </p>
                    </div>
                </div>

                {/* Weather details grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-white/70 text-sm">Cảm giác như</p>
                        <p className="text-white text-xl font-semibold">{weather.feels_like}°C</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-white/70 text-sm">Độ ẩm</p>
                        <p className="text-white text-xl font-semibold">{weather.humidity}%</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-white/70 text-sm">Gió</p>
                        <p className="text-white text-xl font-semibold">{weather.wind_speed || 'N/A'} m/s</p>
                    </div>
                </div>

                {/* Forecast message */}
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-white font-medium">
                        💡 {weather.forecast}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
