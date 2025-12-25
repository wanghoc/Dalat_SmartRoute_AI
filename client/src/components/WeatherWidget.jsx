/**
 * WeatherWidget Component
 * Da Lat SmartRoute
 * 
 * Modern weather display with dynamic animated backgrounds
 */

import { useState, useEffect } from 'react';

/**
 * Generate rain drops for rainy weather
 */
const RainEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <div
                key={i}
                className="rain-drop"
                style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
            />
        ))}
    </div>
);

/**
 * Sun effect for sunny weather
 */
const SunEffect = () => (
    <div className="absolute top-4 right-4 pointer-events-none">
        <div className="sun-rays" />
        <div className="w-16 h-16 bg-yellow-300 rounded-full opacity-90" />
    </div>
);

/**
 * Cloud effect for cloudy weather
 */
const CloudEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud" style={{ top: '20%', left: '10%', width: '80px', height: '30px' }} />
        <div className="cloud" style={{ top: '40%', right: '15%', width: '100px', height: '35px', animationDelay: '5s' }} />
        <div className="cloud" style={{ bottom: '30%', left: '30%', width: '60px', height: '25px', animationDelay: '10s' }} />
    </div>
);

const WeatherWidget = ({ onWeatherChange }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/weather');
                const data = await response.json();

                if (data.success) {
                    setWeather(data.data);
                    if (onWeatherChange) {
                        onWeatherChange(data.data.condition);
                    }
                }
            } catch (err) {
                console.error('Weather fetch error:', err);
                const defaultWeather = {
                    city: 'Đà Lạt',
                    temperature: 18,
                    feels_like: 17,
                    humidity: 85,
                    description: 'Nhiều mây',
                    condition: 'cloudy',
                    forecast: 'Thời tiết tốt cho việc tham quan',
                    is_mock: true
                };
                setWeather(defaultWeather);
                if (onWeatherChange) {
                    onWeatherChange('cloudy');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [onWeatherChange]);

    if (loading) {
        return (
            <div className="h-48 rounded-2xl bg-slate-200 animate-pulse" />
        );
    }

    if (!weather) return null;

    // Get background class based on condition
    const bgClass = {
        sunny: 'weather-sunny',
        clear: 'weather-clear',
        cloudy: 'weather-cloudy',
        rainy: 'weather-rainy'
    }[weather.condition] || 'weather-cloudy';

    const textColor = weather.condition === 'rainy' ? 'text-white' :
        weather.condition === 'cloudy' ? 'text-slate-700' : 'text-slate-800';

    return (
        <div className={`relative rounded-2xl p-6 overflow-hidden ${bgClass}`}>
            {/* Weather effects */}
            {weather.condition === 'rainy' && <RainEffect />}
            {weather.condition === 'sunny' && <SunEffect />}
            {weather.condition === 'cloudy' && <CloudEffect />}

            <div className="relative z-10">
                {/* Location */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className={`text-lg font-semibold ${textColor}`}>
                            {weather.city}
                        </h2>
                        <p className={`text-sm opacity-80 ${textColor}`}>
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                    </div>
                    {weather.is_mock && (
                        <span className="text-xs bg-white/30 px-2 py-1 rounded-full">Demo</span>
                    )}
                </div>

                {/* Temperature */}
                <div className="flex items-end gap-4 mb-4">
                    <span className={`text-6xl font-light ${textColor}`}>
                        {weather.temperature}°
                    </span>
                    <div className={`pb-2 ${textColor}`}>
                        <p className="text-sm capitalize">{weather.description}</p>
                        <p className="text-xs opacity-70">Cảm giác {weather.feels_like}°</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                    <div className={textColor}>
                        <p className="text-xs opacity-70">Độ ẩm</p>
                        <p className="text-sm font-medium">{weather.humidity}%</p>
                    </div>
                    <div className={textColor}>
                        <p className="text-xs opacity-70">Gió</p>
                        <p className="text-sm font-medium">{weather.wind_speed || 0} m/s</p>
                    </div>
                </div>

                {/* Forecast tip */}
                <div className={`mt-4 pt-4 border-t border-white/20 ${textColor}`}>
                    <p className="text-sm">{weather.forecast}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
