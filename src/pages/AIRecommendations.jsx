import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Sun,
    Cloud,
    CloudRain,
    CloudFog,
    MapPin,
    Star,
    ArrowLeft
} from 'lucide-react';

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
// Mock Data - AI Curated Places
// =============================================================================

const aiCuratedPlaces = [
    {
        id: 1,
        name: "Dalat Palace Heritage Hotel",
        category: "Historic Stay",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        rating: 4.8,
        reason: "Perfect for misty weather - cozy French colonial architecture",
        match: 95
    },
    {
        id: 2,
        name: "Me Linh Coffee Garden",
        category: "Café",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
        rating: 4.7,
        reason: "Valley views enhanced by morning fog",
        match: 92
    },
    {
        id: 3,
        name: "Langbiang Peak Trail",
        category: "Adventure",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
        rating: 4.6,
        reason: "Clear skies ideal for panoramic views",
        match: 89
    },
    {
        id: 4,
        name: "Dalat Night Market",
        category: "Local Experience",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
        rating: 4.5,
        reason: "Cool evening weather perfect for street food",
        match: 87
    },
    {
        id: 5,
        name: "Xuan Huong Lake",
        category: "Scenic",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        rating: 4.7,
        reason: "Misty mornings create magical reflections",
        match: 91
    },
    {
        id: 6,
        name: "Crazy House",
        category: "Architecture",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
        rating: 4.4,
        reason: "Indoor exploration ideal for any weather",
        match: 85
    },
    {
        id: 7,
        name: "Datanla Waterfall",
        category: "Nature",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop",
        rating: 4.5,
        reason: "Recent rain makes waterfalls spectacular",
        match: 88
    },
    {
        id: 8,
        name: "Valley of Love",
        category: "Park",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        rating: 4.3,
        reason: "Best enjoyed in cool afternoon weather",
        match: 82
    }
];

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

const PlaceCard = ({ place }) => {
    return (
        <motion.div
            variants={fadeInUp}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Match Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-manrope font-bold text-sm text-slate-900">
                        {place.match}% Match
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <span className="font-manrope text-xs text-white/50 uppercase tracking-wider">
                    {place.category}
                </span>
                <h3 className="font-tenor text-xl text-white mt-1 mb-2">
                    {place.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-manrope text-sm text-white/70">{place.rating}</span>
                </div>

                {/* AI Reason */}
                <p className="font-manrope text-sm text-white/60 leading-relaxed">
                    <Sparkles className="w-3 h-3 inline mr-1 text-white/40" />
                    {place.reason}
                </p>
            </div>
        </motion.div>
    );
};

// =============================================================================
// Main Page Component
// =============================================================================

const AIRecommendations = () => {
    const [currentWeather] = useState('misty'); // Would be dynamic in production
    const WeatherIcon = getWeatherIcon(currentWeather);

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
                        <span className="font-manrope text-sm">Back to Home</span>
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
                                AI-Powered Curation
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-tenor text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
                        >
                            Perfect Spots for
                            <span className="block text-white/60">Today's Weather</span>
                        </motion.h1>

                        {/* Current Weather Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full"
                        >
                            <WeatherIcon className="w-6 h-6 text-white" />
                            <span className="font-manrope text-lg text-white">
                                Misty and Cool · 18°C
                            </span>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            className="font-manrope font-light text-lg text-slate-400 mt-6 max-w-2xl"
                        >
                            Our AI analyzes current weather conditions to recommend the
                            perfect destinations for your Dalat experience.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {aiCuratedPlaces.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </motion.div>
                </div>
            </section>
        </article>
    );
};

export default AIRecommendations;
