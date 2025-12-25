import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    Droplets,
    Wind,
    Thermometer
} from 'lucide-react';

// =============================================================================
// API Configuration
// =============================================================================

const API_KEY = 'e4b5202e7eabe536609be876b6bb82cb';
const DALAT_LAT = 11.94;
const DALAT_LON = 108.43;

// =============================================================================
// Helper Functions
// =============================================================================

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDayName = (dateString, index) => {
    if (index === 0) return 'TODAY';
    const date = new Date(dateString);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[date.getDay()];
};

const getWeatherIcon = (weatherId, size = 'medium') => {
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-20 h-20 md:w-24 md:h-24',
        huge: 'w-28 h-28 md:w-36 md:h-36'
    };

    const iconClass = `${sizeClasses[size]} text-white drop-shadow-lg`;

    if (weatherId >= 200 && weatherId < 300) {
        return <CloudLightning className={iconClass} strokeWidth={1} />;
    } else if (weatherId >= 300 && weatherId < 400) {
        return <CloudRain className={iconClass} strokeWidth={1} />;
    } else if (weatherId >= 500 && weatherId < 600) {
        return <CloudRain className={iconClass} strokeWidth={1} />;
    } else if (weatherId >= 600 && weatherId < 700) {
        return <CloudSnow className={iconClass} strokeWidth={1} />;
    } else if (weatherId >= 700 && weatherId < 800) {
        return <CloudFog className={iconClass} strokeWidth={1} />;
    } else if (weatherId === 800) {
        return <Sun className={iconClass} strokeWidth={1} />;
    } else if (weatherId > 800 && weatherId <= 802) {
        return <CloudSun className={iconClass} strokeWidth={1} />;
    } else {
        return <Cloud className={iconClass} strokeWidth={1} />;
    }
};

const getPoeticalDescription = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
        return "Thunder echoes through the highland valleys.";
    } else if (weatherId >= 300 && weatherId < 400) {
        return "A gentle drizzle dances on the pine leaves.";
    } else if (weatherId >= 500 && weatherId < 600) {
        return "Rain whispers secrets to the misty mountains.";
    } else if (weatherId >= 600 && weatherId < 700) {
        return "A rare blanket of white graces the highlands.";
    } else if (weatherId >= 700 && weatherId < 800) {
        return "Mystical mist weaves through the ancient pines.";
    } else if (weatherId === 800) {
        return "Golden sunlight bathes the eternal spring.";
    } else if (weatherId > 800) {
        return "Clouds drift lazily across the highland sky.";
    }
    return "The highlands await your discovery.";
};

// =============================================================================
// Day Forecast Card Component
// =============================================================================

const DayCard = ({ day, isToday }) => {
    return (
        <div className={`
            flex-shrink-0 
            flex flex-col items-center justify-center
            px-5 py-6 rounded-2xl
            ${isToday
                ? 'bg-white/20 border border-white/30'
                : 'bg-white/10 border border-white/15 hover:bg-white/15'
            }
            backdrop-blur-sm
            transition-all duration-300
            min-w-[100px]
        `}>
            {/* Day Name */}
            <p className={`
                font-manrope text-xs font-semibold uppercase tracking-widest
                ${isToday ? 'text-white' : 'text-white/70'}
                mb-3
            `}>
                {day.dayName}
            </p>

            {/* Weather Icon */}
            <div className="mb-3">
                {getWeatherIcon(day.weatherId, 'small')}
            </div>

            {/* Temp Range */}
            <p className="font-tenor text-lg text-white mb-1">
                {day.maxTemp}° / {day.minTemp}°
            </p>

            {/* Condition */}
            <p className="font-manrope text-xs text-white/60 text-center">
                {day.condition}
            </p>
        </div>
    );
};

// =============================================================================
// Main Weather Page Component
// =============================================================================

const Weather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Fetch current weather
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${API_KEY}`
                );
                if (!currentResponse.ok) throw new Error('Current weather unavailable');
                const currentData = await currentResponse.json();

                setCurrentWeather({
                    temp: Math.round(currentData.main.temp),
                    feelsLike: Math.round(currentData.main.feels_like),
                    humidity: currentData.main.humidity,
                    windSpeed: currentData.wind.speed,
                    description: capitalizeWords(currentData.weather[0].description),
                    weatherId: currentData.weather[0].id
                });

                // Fetch 5-day/3-hour forecast and process into daily
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${API_KEY}`
                );
                if (!forecastResponse.ok) throw new Error('Forecast unavailable');
                const forecastData = await forecastResponse.json();

                // Process 3-hour intervals into daily summary
                const dailyMap = new Map();

                forecastData.list.forEach((item) => {
                    const date = item.dt_txt.split(' ')[0];

                    if (!dailyMap.has(date)) {
                        dailyMap.set(date, {
                            date,
                            temps: [],
                            weatherIds: [],
                            conditions: []
                        });
                    }

                    const dayData = dailyMap.get(date);
                    dayData.temps.push(item.main.temp);
                    dayData.weatherIds.push(item.weather[0].id);
                    dayData.conditions.push(item.weather[0].main);
                });

                // Convert to array and take first 7 days
                const dailyForecast = Array.from(dailyMap.values())
                    .slice(0, 7)
                    .map((day, index) => ({
                        dayName: getDayName(day.date, index),
                        maxTemp: Math.round(Math.max(...day.temps)),
                        minTemp: Math.round(Math.min(...day.temps)),
                        weatherId: day.weatherIds[Math.floor(day.weatherIds.length / 2)], // Noon-ish
                        condition: capitalizeWords(day.conditions[Math.floor(day.conditions.length / 2)])
                    }));

                setForecast(dailyForecast);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="relative min-h-screen bg-gradient-to-b from-[#587F72] to-[#FAFAF9]">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                        <p className="font-manrope text-[#2C3E2D]">Loading weather data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="relative min-h-screen bg-gradient-to-b from-[#587F72] to-[#FAFAF9]">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <CloudFog className="w-16 h-16 text-[#2C3E2D]/50 mx-auto mb-4" />
                        <p className="font-tenor text-2xl text-[#2C3E2D] mb-2">Weather Unavailable</p>
                        <p className="font-manrope text-[#2C3E2D]/60 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-[#2C3E2D] transition-all backdrop-blur-sm"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#587F72] via-[#7A9E8E] to-[#FAFAF9]">

            {/* Main Content */}
            <main className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
                {/* The Glass Palace - Main Container */}
                <div className="
                    w-full max-w-5xl
                    bg-white/10 backdrop-blur-xl
                    border border-white/20
                    rounded-[3rem]
                    shadow-2xl
                    p-8 md:p-12 lg:p-16
                    animate-fade-in-up
                ">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <p className="font-manrope text-sm text-white/60 uppercase tracking-[0.3em] mb-2">
                            Dalat Highlands
                        </p>
                        <h1 className="font-tenor text-4xl md:text-5xl text-white">
                            Weather Forecast
                        </h1>
                    </div>

                    {/* Today's Highlight Section */}
                    {currentWeather && (
                        <div className="
                            bg-white/5 backdrop-blur-sm
                            border border-white/10
                            rounded-3xl
                            p-8 md:p-10
                            mb-10
                        ">
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                {/* Large Icon */}
                                <div className="animate-float flex-shrink-0">
                                    {getWeatherIcon(currentWeather.weatherId, 'huge')}
                                </div>

                                {/* Temperature & Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <p className="font-tenor text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-lg">
                                        {currentWeather.temp}°C
                                    </p>
                                    <p className="font-manrope text-lg md:text-xl text-white/80 uppercase tracking-widest mt-2">
                                        {currentWeather.description}
                                    </p>
                                    <p className="font-manrope text-base text-white/60 italic mt-4 max-w-md">
                                        "{getPoeticalDescription(currentWeather.weatherId)}"
                                    </p>
                                </div>

                                {/* Side Stats */}
                                <div className="flex flex-row md:flex-col gap-6 text-white/70">
                                    <div className="flex items-center gap-3">
                                        <Thermometer className="w-5 h-5" strokeWidth={1.5} />
                                        <div>
                                            <p className="font-manrope text-xs uppercase tracking-wider text-white/50">Feels Like</p>
                                            <p className="font-tenor text-xl text-white">{currentWeather.feelsLike}°</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Droplets className="w-5 h-5" strokeWidth={1.5} />
                                        <div>
                                            <p className="font-manrope text-xs uppercase tracking-wider text-white/50">Humidity</p>
                                            <p className="font-tenor text-xl text-white">{currentWeather.humidity}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Wind className="w-5 h-5" strokeWidth={1.5} />
                                        <div>
                                            <p className="font-manrope text-xs uppercase tracking-wider text-white/50">Wind</p>
                                            <p className="font-tenor text-xl text-white">{currentWeather.windSpeed} m/s</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7-Day Forecast Section */}
                    <div>
                        <h2 className="font-tenor text-xl text-white/80 mb-6 text-center md:text-left">
                            Extended Forecast
                        </h2>

                        {/* Horizontal Scrollable Row */}
                        <div className="
                            flex gap-3 overflow-x-auto 
                            scrollbar-hide 
                            pb-2 -mx-2 px-2
                            snap-x snap-mandatory
                        ">
                            {forecast.map((day, index) => (
                                <DayCard
                                    key={day.dayName + index}
                                    day={day}
                                    isToday={index === 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Weather;
