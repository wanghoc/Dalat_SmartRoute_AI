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
    Thermometer,
    ChevronDown,
    ChevronUp,
    Clock,
    Shirt,
    MapPin,
    Coffee,
    TreePine,
    Camera,
    Sparkles,
    Flame,
    Snowflake,
    Minus
} from 'lucide-react';

// =============================================================================
// API Configuration
// =============================================================================

const API_KEY = 'e4b5202e7eabe536609be876b6bb82cb';
const DALAT_LAT = 11.94;
const DALAT_LON = 108.43;

// =============================================================================
// Place Recommendations Data
// =============================================================================

const INDOOR_PLACES = [
    {
        id: 1,
        title: "Still Cafe",
        subtitle: "Cozy mountain retreat",
        image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop",
        category: "Cafe"
    },
    {
        id: 2,
        title: "Dalat Railway Museum",
        subtitle: "Historic French architecture",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
        category: "Museum"
    },
    {
        id: 3,
        title: "Crazy House",
        subtitle: "Whimsical wonderland",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
        category: "Landmark"
    }
];

const OUTDOOR_PLACES = [
    {
        id: 4,
        title: "Xuan Huong Lake",
        subtitle: "Serene highland waters",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        category: "Nature"
    },
    {
        id: 5,
        title: "Valley of Love",
        subtitle: "Romantic hillside escape",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
        category: "Park"
    },
    {
        id: 6,
        title: "Datanla Waterfall",
        subtitle: "Adventure awaits",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
        category: "Waterfall"
    }
];

// =============================================================================
// Helper Functions
// =============================================================================

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDayName = (dateString, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

const formatHour = (dtTxt) => {
    const time = dtTxt.split(' ')[1];
    const hour = parseInt(time.split(':')[0], 10);
    // Cap at 23:00, never show 24:00
    const displayHour = hour >= 24 ? 0 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00`;
};

const getTimePeriod = (hour) => {
    if (hour < 6) return 'Night';
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
};

const getWeatherIcon = (weatherId, size = 'medium') => {
    const sizeClasses = {
        tiny: 'w-5 h-5',
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
        huge: 'w-24 h-24 md:w-32 md:h-32',
        giant: 'w-32 h-32 md:w-40 md:h-40'
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

const isRainyWeather = (weatherId) => {
    return (weatherId >= 200 && weatherId < 700);
};

// =============================================================================
// OOTD Logic - 3-Part Outfit Guide with Preferences
// =============================================================================

const getDetailedOOTD = (temp, weatherId, preference = 'standard') => {
    // Adjust effective temperature based on preference
    let effectiveTemp = temp;
    if (preference === 'warmer') {
        effectiveTemp -= 4; // Dress as if it's 4 degrees colder
    } else if (preference === 'cooler') {
        effectiveTemp += 4; // Dress as if it's 4 degrees warmer
    }

    // Rainy weather override
    if (isRainyWeather(weatherId)) {
        if (preference === 'warmer') {
            return {
                title: "Extra Rain Protection",
                outerwear: "Heavy Waterproof Jacket",
                top: "Warm Fleece Layer",
                bottom: "Waterproof Pants"
            };
        } else if (preference === 'cooler') {
            return {
                title: "Light Rain Gear",
                outerwear: "Light Rain Shell",
                top: "Breathable Tee",
                bottom: "Quick-dry Shorts"
            };
        }
        return {
            title: "Rain Ready",
            outerwear: "Waterproof Jacket",
            top: "Light Sweater",
            bottom: "Quick-dry Pants"
        };
    }

    // Temperature-based recommendations with preference adjustments
    if (effectiveTemp < 14) {
        return {
            title: "Full Winter Mode",
            outerwear: "Heavy Coat with Scarf",
            top: "Thick Knitwear",
            bottom: "Insulated Pants"
        };
    } else if (effectiveTemp < 18) {
        return {
            title: "Cozy Layers",
            outerwear: "Warm Jacket",
            top: "Hoodie or Sweater",
            bottom: "Thick Jeans"
        };
    } else if (effectiveTemp < 22) {
        return {
            title: "Balanced Comfort",
            outerwear: "Light Cardigan",
            top: "Long Sleeve Shirt",
            bottom: "Jeans or Chinos"
        };
    } else if (effectiveTemp < 26) {
        return {
            title: "Light and Breezy",
            outerwear: "Optional Layer",
            top: "T-shirt or Blouse",
            bottom: "Light Pants"
        };
    } else {
        return {
            title: "Stay Cool",
            outerwear: "None Needed",
            top: "Sleeveless or Tank",
            bottom: "Shorts or Skirt"
        };
    }
};

// =============================================================================
// Component: Outfit Icon (Monochrome White)
// =============================================================================

const OutfitIcon = ({ type }) => {
    const iconClass = "w-8 h-8 text-white drop-shadow-md";

    switch (type) {
        case 'outerwear':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3L8 7H4v12h16V7h-4L12 3z" />
                    <path d="M8 7v12M16 7v12" />
                </svg>
            );
        case 'top':
            return <Shirt className={iconClass} />;
        case 'bottom':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 4h12v6l-2 10H8L6 10V4z" />
                    <path d="M6 10h12" />
                    <path d="M12 10v10" />
                </svg>
            );
        default:
            return <Shirt className={iconClass} />;
    }
};

// =============================================================================
// Component: Detailed OOTD Card with Preference Tabs
// =============================================================================

const OOTDCard = ({ temp, weatherId }) => {
    const [preference, setPreference] = useState('standard');
    const ootd = getDetailedOOTD(temp, weatherId, preference);

    const PreferenceTab = ({ value, icon: Icon, label }) => (
        <button
            onClick={() => setPreference(value)}
            className={`
                flex-1 flex items-center justify-center gap-2
                py-2.5 px-3 rounded-xl
                font-manrope text-xs font-medium
                transition-all duration-200
                ${preference === value
                    ? 'bg-white/25 text-white border border-white/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                }
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const OutfitRow = ({ type, label, value }) => (
        <div className="flex items-center gap-5 py-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <OutfitIcon type={type} />
            </div>
            <div className="flex-1">
                <p className="font-manrope text-xs text-white/50 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="font-manrope text-base md:text-lg text-white font-medium">
                    {value}
                </p>
            </div>
        </div>
    );

    return (
        <div className="
            h-full
            bg-white/15 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-6 md:p-8
            flex flex-col
        ">
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Shirt className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div>
                    <span className="font-manrope text-xs text-white/50 uppercase tracking-widest block mb-1">
                        Outfit Guide
                    </span>
                    <h3 className="font-tenor text-2xl text-white">{ootd.title}</h3>
                </div>
            </div>

            {/* Preference Tabs */}
            <div className="flex gap-2 mb-6">
                <PreferenceTab value="warmer" icon={Flame} label="Warmer" />
                <PreferenceTab value="standard" icon={Minus} label="Standard" />
                <PreferenceTab value="cooler" icon={Snowflake} label="Cooler" />
            </div>

            {/* 3-Part Outfit List */}
            <div className="flex-1 flex flex-col justify-evenly divide-y divide-white/10">
                <OutfitRow type="outerwear" label="Outerwear" value={ootd.outerwear} />
                <OutfitRow type="top" label="Top" value={ootd.top} />
                <OutfitRow type="bottom" label="Bottom" value={ootd.bottom} />
            </div>
        </div>
    );
};

// =============================================================================
// Component: Hourly Detail Row
// =============================================================================

const HourlyRow = ({ hour }) => {
    return (
        <div className="
            flex items-center justify-between
            py-3 px-4
            bg-white/5 rounded-xl
            border border-white/10
        ">
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="font-manrope text-sm text-white/80 w-14">{hour.time}</span>
                <span className="font-manrope text-xs text-white/40 hidden sm:inline">
                    {hour.period}
                </span>
            </div>
            <div className="flex items-center gap-4">
                {getWeatherIcon(hour.weatherId, 'small')}
                <span className="font-tenor text-lg text-white w-12 text-right">
                    {hour.temp}°
                </span>
            </div>
        </div>
    );
};

// =============================================================================
// Component: Day Forecast Card (Expandable)
// =============================================================================

const DayForecastCard = ({ day, isExpanded, onToggle, hourlyData }) => {
    return (
        <div className="
            bg-white/10 backdrop-blur-md
            border border-white/15
            rounded-2xl
            overflow-hidden
            transition-all duration-300
        ">
            {/* Main Day Row - Clickable */}
            <button
                onClick={onToggle}
                className="
                    w-full flex items-center justify-between
                    p-5 md:p-6
                    hover:bg-white/5 transition-colors
                    text-left
                "
            >
                <div className="flex items-center gap-4 md:gap-6">
                    {getWeatherIcon(day.weatherId, 'medium')}
                    <div>
                        <h3 className="font-tenor text-lg md:text-xl text-white">
                            {day.dayName}
                        </h3>
                        <p className="font-manrope text-sm text-white/60">
                            {day.condition}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                        <p className="font-tenor text-2xl text-white">{day.maxTemp}°</p>
                        <p className="font-manrope text-sm text-white/50">{day.minTemp}°</p>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                </div>
            </button>

            {/* Expanded Hourly Details */}
            <div className={`
                overflow-hidden transition-all duration-500 ease-out
                ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="px-5 pb-5 space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="font-manrope text-xs text-white/50 uppercase tracking-wider">
                            Hourly Breakdown
                        </span>
                    </div>
                    {hourlyData.length > 0 ? (
                        hourlyData.map((hour, idx) => (
                            <HourlyRow key={idx} hour={hour} />
                        ))
                    ) : (
                        <p className="text-white/40 text-sm font-manrope py-4 text-center">
                            No hourly data available
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Component: Recommendation Card
// =============================================================================

const RecommendationCard = ({ place }) => {
    return (
        <Link
            to={`/place/${place.id}`}
            className="
                group relative
                bg-white/10 backdrop-blur-md
                border border-white/15
                rounded-2xl
                overflow-hidden
                hover:bg-white/15 hover:border-white/25
                transition-all duration-300
                block
            "
        >
            {/* Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
                <img
                    src={place.image}
                    alt={place.title}
                    className="
                        w-full h-full object-cover
                        group-hover:scale-105 transition-transform duration-500
                    "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="
                    absolute top-3 left-3
                    px-3 py-1 rounded-full
                    bg-white/20 backdrop-blur-sm
                    text-xs font-manrope text-white
                ">
                    {place.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-tenor text-lg text-white mb-1">{place.title}</h4>
                <div className="flex items-center gap-1.5 text-white/60">
                    <MapPin className="w-3 h-3" />
                    <span className="font-manrope text-xs">{place.subtitle}</span>
                </div>
            </div>
        </Link>
    );
};

// =============================================================================
// Main Weather Page Component
// =============================================================================

const Weather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyByDay, setHourlyByDay] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Fetch current weather
                const currentResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${API_KEY}`
                );
                if (!currentResponse.ok) throw new Error('Weather data unavailable');
                const currentData = await currentResponse.json();

                setCurrentWeather({
                    temp: Math.round(currentData.main.temp),
                    feelsLike: Math.round(currentData.main.feels_like),
                    humidity: currentData.main.humidity,
                    windSpeed: currentData.wind.speed,
                    description: capitalizeWords(currentData.weather[0].description),
                    weatherId: currentData.weather[0].id
                });

                // Fetch 5-day/3-hour forecast
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${API_KEY}`
                );
                if (!forecastResponse.ok) throw new Error('Forecast unavailable');
                const forecastData = await forecastResponse.json();

                // Process data
                const dailyMap = new Map();
                const hourlyMap = {};

                forecastData.list.forEach((item) => {
                    const date = item.dt_txt.split(' ')[0];
                    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0], 10);

                    // Skip if hour is 24 or beyond (edge case)
                    if (hour >= 24) return;

                    // Daily summary
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

                    // Hourly data - include all times up to 23:00
                    if (!hourlyMap[date]) {
                        hourlyMap[date] = [];
                    }

                    hourlyMap[date].push({
                        time: formatHour(item.dt_txt),
                        period: getTimePeriod(hour),
                        temp: Math.round(item.main.temp),
                        weatherId: item.weather[0].id
                    });
                });

                const dailyForecast = Array.from(dailyMap.values())
                    .slice(0, 5)
                    .map((day, index) => ({
                        date: day.date,
                        dayName: getDayName(day.date, index),
                        maxTemp: Math.round(Math.max(...day.temps)),
                        minTemp: Math.round(Math.min(...day.temps)),
                        weatherId: day.weatherIds[Math.floor(day.weatherIds.length / 2)],
                        condition: capitalizeWords(day.conditions[Math.floor(day.conditions.length / 2)])
                    }));

                setForecast(dailyForecast);
                setHourlyByDay(hourlyMap);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    // Determine recommendations based on weather
    const getRecommendedPlaces = () => {
        if (!currentWeather) return OUTDOOR_PLACES;
        return isRainyWeather(currentWeather.weatherId) ? INDOOR_PLACES : OUTDOOR_PLACES;
    };

    const getRecommendationTitle = () => {
        if (!currentWeather) return "Explore Dalat";
        return isRainyWeather(currentWeather.weatherId)
            ? "Cozy Indoor Retreats"
            : "Outdoor Adventures";
    };

    const getRecommendationIcon = () => {
        if (!currentWeather) return <Camera className="w-5 h-5 text-white/70" />;
        return isRainyWeather(currentWeather.weatherId)
            ? <Coffee className="w-5 h-5 text-white/70" />
            : <TreePine className="w-5 h-5 text-white/70" />;
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                        <p className="font-manrope text-white">Loading weather data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <CloudFog className="w-16 h-16 text-white/50 mx-auto mb-4" />
                        <p className="font-tenor text-2xl text-white mb-2">Weather Unavailable</p>
                        <p className="font-manrope text-white/60">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Main Content - Full Width Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

                {/* ============================================================= */}
                {/* SECTION 1: Current Weather and OOTD */}
                {/* ============================================================= */}
                <section className="mb-12 md:mb-16">
                    {/* Section Header - Subtle and Elegant */}
                    <div className="mb-8">
                        <p className="font-manrope text-xs text-white/50 uppercase tracking-[0.3em] mb-2">
                            Dalat Highlands
                        </p>
                        <h1 className="font-tenor text-2xl md:text-3xl text-white">
                            Current Conditions
                        </h1>
                    </div>

                    {/* Current Weather and OOTD - Equal Height Grid */}
                    {currentWeather && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Main Weather Card */}
                            <div className="
                                h-full
                                bg-white/10 backdrop-blur-xl
                                border border-white/15
                                rounded-3xl
                                p-8 md:p-10
                                flex flex-col justify-center
                            ">
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div className="animate-float mb-6">
                                        {getWeatherIcon(currentWeather.weatherId, 'giant')}
                                    </div>

                                    {/* Temperature */}
                                    <p className="font-tenor text-8xl md:text-9xl text-white drop-shadow-lg">
                                        {currentWeather.temp}°
                                    </p>
                                    <p className="font-manrope text-lg md:text-xl text-white/80 uppercase tracking-widest mt-2">
                                        {currentWeather.description}
                                    </p>

                                    {/* Stats Row */}
                                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                Feels like {currentWeather.feelsLike}°
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                {currentWeather.humidity}% Humidity
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                Wind {currentWeather.windSpeed} m/s
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* OOTD Card - Same Height */}
                            <OOTDCard
                                temp={currentWeather.temp}
                                weatherId={currentWeather.weatherId}
                            />
                        </div>
                    )}
                </section>

                {/* ============================================================= */}
                {/* SECTION 2: Day Forecast */}
                {/* ============================================================= */}
                <section className="mb-12 md:mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-5 h-5 text-white/70" />
                        <h2 className="font-tenor text-xl text-white">Day Forecast</h2>
                    </div>
                    <p className="font-manrope text-sm text-white/50 mb-6">
                        Tap any day to see the full hourly breakdown
                    </p>

                    <div className="space-y-3">
                        {forecast.map((day) => (
                            <DayForecastCard
                                key={day.date}
                                day={day}
                                isExpanded={expandedDay === day.date}
                                onToggle={() => setExpandedDay(
                                    expandedDay === day.date ? null : day.date
                                )}
                                hourlyData={hourlyByDay[day.date] || []}
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================================= */}
                {/* SECTION 3: Smart Recommendations */}
                {/* ============================================================= */}
                <section>
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-white/70" />
                        <span className="font-manrope text-xs text-white/60 uppercase tracking-wider">
                            Smart Suggestions
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        {getRecommendationIcon()}
                        <h2 className="font-tenor text-xl text-white">
                            {getRecommendationTitle()}
                        </h2>
                    </div>
                    <p className="font-manrope text-sm text-white/50 mb-8">
                        Perfect destinations based on current conditions
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getRecommendedPlaces().map((place) => (
                            <RecommendationCard key={place.id} place={place} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Weather;
