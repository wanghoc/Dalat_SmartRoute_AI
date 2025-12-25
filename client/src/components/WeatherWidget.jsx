/**
 * WeatherWidget Component
 * Da Lat SmartRoute
 * 
 * Modern weather display with dynamic animated backgrounds
 */

import { useState, useEffect } from 'react';

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

const SunEffect = () => (
    <div className="absolute top-4 right-4 pointer-events-none">
        <div className="sun-rays" />
        <div className="w-20 h-20 bg-yellow-200 rounded-full opacity-90 shadow-lg" />
    </div>
);

const CloudEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud" style={{ top: '20%', left: '10%', width: '80px', height: '30px' }} />
        <div className="cloud" style={{ top: '40%', right: '15%', width: '100px', height: '35px', animationDelay: '5s' }} />
        <div className="cloud" style={{ bottom: '30%', left: '30%', width: '60px', height: '25px', animationDelay: '10s' }} />
    </div>
);

const WeatherWidget = ({ onWeatherChange, onTemperatureChange }) => {
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
                    if (onTemperatureChange) {
                        onTemperatureChange(data.data.temperature);
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
                if (onWeatherChange) onWeatherChange('cloudy');
                if (onTemperatureChange) onTemperatureChange(18);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [onWeatherChange, onTemperatureChange]);

    if (loading) {
        return (
            <div className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
        );
    }

    if (!weather) return null;

    const bgClass = {
        sunny: 'weather-sunny',
        clear: 'weather-clear',
        cloudy: 'weather-cloudy',
        rainy: 'weather-rainy'
    }[weather.condition] || 'weather-cloudy';

    const textColor = weather.condition === 'rainy' ? 'text-white' : 'text-slate-800';

    return (
        <div className={`relative rounded-2xl p-8 overflow-hidden shadow-xl ${bgClass}`}>
            {/* Weather effects */}
            {weather.condition === 'rainy' && <RainEffect />}
            {weather.condition === 'sunny' && <SunEffect />}
            {weather.condition === 'cloudy' && <CloudEffect />}

            <div className="relative z-10">
                {/* Location */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className={`text-xl font-semibold ${textColor}`}>
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

                {/* Temperature - BIGGER */}
                <div className="flex items-end gap-4 mb-6">
                    <span className={`text-7xl font-light ${textColor}`}>
                        {weather.temperature}°
                    </span>
                    <div className={`pb-3 ${textColor}`}>
                        <p className="text-base capitalize font-medium">{weather.description}</p>
                        <p className="text-sm opacity-70">Cảm giác {weather.feels_like}°</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`${textColor}`}>
                        <p className="text-xs opacity-70">Độ ẩm</p>
                        <p className="text-lg font-semibold">{weather.humidity}%</p>
                    </div>
                    <div className={`${textColor}`}>
                        <p className="text-xs opacity-70">Gió</p>
                        <p className="text-lg font-semibold">{weather.wind_speed || 0} m/s</p>
                    </div>
                    <div className={`${textColor}`}>
                        <p className="text-xs opacity-70">Tình trạng</p>
                        <p className="text-lg font-semibold capitalize">{weather.condition}</p>
                    </div>
                </div>

                {/* Forecast tip */}
                <div className={`pt-4 border-t ${weather.condition === 'rainy' ? 'border-white/20' : 'border-slate-300/30'} ${textColor}`}>
                    <p className="text-sm leading-relaxed">{weather.forecast}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
