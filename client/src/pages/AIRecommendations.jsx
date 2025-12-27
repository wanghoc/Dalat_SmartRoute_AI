import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Sparkles,
    Sun,
    Cloud,
    CloudRain,
    CloudFog,
    MapPin,
    Star,
    ArrowLeft,
    Loader2
} from 'lucide-react';

// =============================================================================
// API Configuration
// =============================================================================
const API_BASE = 'http://localhost:3001/api';

// =============================================================================
// Animation Variants
// =============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

// =============================================================================
// Weather Icon Helper
// =============================================================================

const getWeatherIcon = (condition) => {
    switch (condition) {
        case 'sunny': return Sun;
        case 'cloudy': return Cloud;
        case 'rainy': return CloudRain;
        default: return CloudFog;
    }
};

// =============================================================================
// Place Card Component
// =============================================================================

const PlaceCard = ({ place, isVietnamese }) => {
    const name = isVietnamese && place.titleVi ? place.titleVi : place.title;
    const description = isVietnamese && place.descriptionVi ? place.descriptionVi : place.description;
    const { t } = useTranslation();

    // Calculate a "match" percentage based on rating (for display purposes)
    const matchPercentage = Math.round((place.rating || 4.5) * 20);

    return (
        <Link to={`/place/${place.id}`}>
            <motion.div
                variants={fadeInUp}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={place.imagePath}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Match Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="font-manrope font-bold text-sm text-slate-900">
                            {matchPercentage}% {t('aiRecs.match')}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <span className="font-manrope text-xs text-white/50 uppercase tracking-wider">
                        {place.category?.name || 'Attraction'}
                    </span>
                    <h3 className="font-tenor text-xl text-white mt-1 mb-2">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-manrope text-sm text-white/70">{place.rating || 4.5}</span>
                    </div>

                    {/* AI Reason - using the designer tip as the reason */}
                    <p className="font-manrope text-sm text-white/60 leading-relaxed line-clamp-2">
                        <Sparkles className="w-3 h-3 inline mr-1 text-white/40" />
                        {place.designerTip || description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

// =============================================================================
// Main Page Component
// =============================================================================

const AIRecommendations = () => {
    const { t, i18n } = useTranslation();
    const [currentWeather] = useState('misty');
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [temperature, setTemperature] = useState(18);

    const isVietnamese = i18n.language === 'vi';
    const WeatherIcon = getWeatherIcon(currentWeather);

    // Fetch places from API
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/places?limit=12`);
                const data = await response.json();
                setPlaces(data);
            } catch (error) {
                console.error('Failed to fetch places:', error);
            } finally {
                setLoading(false);
            }
        };

        // Also fetch current weather
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=11.9404&lon=108.4583&units=metric&appid=bd5e378503939ddaee76f12ad7a97608`
                );
                const data = await response.json();
                if (data.main) {
                    setTemperature(Math.round(data.main.temp));
                }
            } catch (error) {
                console.error('Weather fetch failed:', error);
            }
        };

        fetchPlaces();
        fetchWeather();
    }, []);

    const weatherText = isVietnamese
        ? `Sương mù và Mát mẻ · ${temperature}°C`
        : `Misty and Cool · ${temperature}°C`;

    return (
        <article className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-manrope text-sm">{t('aiRecs.backToHome')}</span>
                    </Link>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Eyebrow */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center gap-3 mb-4"
                        >
                            <Sparkles className="w-5 h-5 text-white/60" />
                            <span className="font-manrope text-sm text-white/50 uppercase tracking-[0.3em]">
                                {t('aiRecs.eyebrow')}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-tenor text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
                        >
                            {t('aiRecs.title')}
                            <span className="block text-white/60">{t('aiRecs.subtitle')}</span>
                        </motion.h1>

                        {/* Current Weather Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full"
                        >
                            <WeatherIcon className="w-6 h-6 text-white" />
                            <span className="font-manrope text-lg text-white">
                                {weatherText}
                            </span>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            className="font-manrope font-light text-lg text-slate-400 mt-6 max-w-2xl"
                        >
                            {t('aiRecs.description')}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {places.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    isVietnamese={isVietnamese}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </article>
    );
};

export default AIRecommendations;
