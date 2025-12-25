import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
    Search,
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    Droplets,
    Wind,
    MapPin,
    Heart,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    ExternalLink,
    Map
} from 'lucide-react';

import ChatWidget from './components/ChatWidget';
import DetailPage from './pages/Detail';
import Weather from './pages/Weather';

// =============================================================================
// DUMMY DATA - Replace with API calls in production
// =============================================================================

const recommendedPlaces = [
    {
        id: 1,
        title: "Langbiang Mountain",
        location: "Lạc Dương District",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop&crop=center",
        description: "A mystical peak wrapped in morning mist, offering panoramic views of the highlands.",
        category: "Nature"
    },
    {
        id: 2,
        title: "Hồ Tuyền Lâm",
        location: "Trại Mát Ward",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=800&fit=crop&crop=center",
        description: "A serene lake surrounded by pine forests, perfect for contemplative mornings.",
        category: "Lake"
    },
    {
        id: 3,
        title: "The Married Café",
        location: "Phường 4, Dalat",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=800&fit=crop&crop=center",
        description: "Where artisanal coffee meets French colonial architecture in a garden setting.",
        category: "Café"
    },
    {
        id: 4,
        title: "Valley of Love",
        location: "Phường 8, Dalat",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop&crop=center",
        description: "Rolling hills adorned with wildflowers, a timeless romantic escape.",
        category: "Nature"
    },
    {
        id: 5,
        title: "Datanla Waterfall",
        location: "Prenn Pass",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=800&fit=crop&crop=center",
        description: "Crystal waters cascading through ancient forest, an adventure in nature.",
        category: "Waterfall"
    },
    {
        id: 6,
        title: "Mai Anh Đào Street",
        location: "Phường 3, Dalat",
        image: "https://images.unsplash.com/photo-1462275646964-a0e3571f4f5c?w=600&h=800&fit=crop&crop=center",
        description: "Cherry blossom lanes that transform into a pink dreamscape each spring.",
        category: "Street"
    }
];

// TODO: Connect to backend recommendations API
// const fetchRecommendations = async (userId) => { ... }

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

// TODO: Connect OpenWeatherMap API here
// const fetchWeatherData = async (lat, lng) => {
//   const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
//   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);
//   return response.json();
// }

// =============================================================================
// HELPER: Get Weather Tip Based on Weather ID
// =============================================================================

const getWeatherTip = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
        return "Thunderstorms expected. Stay indoors if possible.";
    } else if (weatherId >= 300 && weatherId < 400) {
        return "Light drizzle. A light jacket should suffice.";
    } else if (weatherId >= 500 && weatherId < 600) {
        return "Don't forget your umbrella.";
    } else if (weatherId >= 600 && weatherId < 700) {
        return "Rare snow in Dalat! Bundle up warmly.";
    } else if (weatherId >= 700 && weatherId < 800) {
        return "Misty conditions. Drive carefully.";
    } else if (weatherId === 800) {
        return "Great day for a walk or outdoor exploration.";
    } else if (weatherId > 800) {
        return "Partly cloudy. Perfect for sightseeing.";
    }
    return "Enjoy your visit to Dalat!";
};

// =============================================================================
// HELPER: Get Weather Icon Based on Weather ID
// =============================================================================

const getWeatherIconByCode = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
        return <CloudLightning className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId >= 300 && weatherId < 400) {
        return <CloudRain className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId >= 500 && weatherId < 600) {
        return <CloudRain className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId >= 600 && weatherId < 700) {
        return <CloudSnow className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId >= 700 && weatherId < 800) {
        return <CloudFog className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId === 800) {
        return <Sun className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else if (weatherId > 800 && weatherId <= 802) {
        return <CloudSun className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    } else {
        return <Cloud className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />;
    }
};

// =============================================================================
// HELPER: Capitalize first letter of each word
// =============================================================================

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// =============================================================================
// COMPONENT: WeatherColumn (Vertical Bold Weather Display)
// =============================================================================

const WeatherColumn = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    'https://api.openweathermap.org/data/2.5/weather?lat=11.94&lon=108.43&units=metric&lang=en&appid=e4b5202e7eabe536609be876b6bb82cb'
                );
                if (!response.ok) throw new Error('Weather data unavailable');
                const data = await response.json();
                setWeather({
                    temp: Math.round(data.main.temp),
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    description: capitalizeWords(data.weather[0].description),
                    weatherId: data.weather[0].id
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // Loading skeleton
    if (loading) {
        return (
            <div className="flex flex-col items-center text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 bg-white/20 rounded-full" />
                <div className="h-16 w-24 bg-white/20 rounded-lg" />
                <div className="h-5 w-32 bg-white/20 rounded" />
            </div>
        );
    }

    // Error/fallback state
    if (error || !weather) {
        return (
            <div className="flex flex-col items-center text-center space-y-2">
                <CloudSun className="w-16 h-16 text-white/50" strokeWidth={1} />
                <p className="font-tenor text-5xl text-white/50">--°C</p>
                <p className="font-manrope text-sm text-white/50 uppercase tracking-widest">
                    Unavailable
                </p>
            </div>
        );
    }

    // Get large weather icon
    const getLargeWeatherIcon = (weatherId) => {
        const iconClass = "w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg";
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

    return (
        <div className="
            relative flex flex-col items-center text-center
            pl-8 md:pl-12 
            border-l border-white/20
            bg-white/5 backdrop-blur-sm
            py-8 px-6 md:px-10 rounded-2xl
            animate-fade-in-up
        ">
            {/* Top: Huge Icon + Temperature */}
            <div className="flex flex-col items-center mb-6">
                <div className="animate-float mb-3">
                    {getLargeWeatherIcon(weather.weatherId)}
                </div>
                <p className="font-tenor text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-lg">
                    {weather.temp}°C
                </p>
            </div>

            {/* Middle: Uppercase Description */}
            <p className="
                font-manrope text-sm md:text-base text-white/90
                uppercase tracking-[0.25em] font-medium
                mb-6
            ">
                {weather.description}
            </p>

            {/* Bottom: Vertical Details List */}
            <div className="flex flex-col items-center space-y-3 text-white/80">
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-manrope text-sm">
                        {weather.humidity}% Humidity
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-manrope text-sm">
                        {weather.windSpeed} m/s Wind
                    </span>
                </div>
            </div>

            {/* Weather Tip */}
            <p className="
                font-manrope text-xs text-white/60 italic
                mt-6 max-w-[200px]
            ">
                {getWeatherTip(weather.weatherId)}
            </p>
        </div>
    );
};

// =============================================================================
// COMPONENT: SearchBar (Hybrid Trigger)
// =============================================================================

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`
                relative flex items-center gap-3 px-6 md:px-8 py-4 md:py-5
                bg-white rounded-full shadow-xl
                transition-all duration-300 ease-out
                ${isFocused ? 'shadow-2xl scale-[1.01]' : 'shadow-xl'}
            `}
            role="search"
            aria-label="Search destinations"
        >
            <Search
                className={`
                    w-5 h-5 md:w-6 md:h-6 transition-colors duration-300
                    ${isFocused ? 'text-primary' : 'text-foreground/40'}
                `}
                strokeWidth={1.5}
            />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Where does your heart want to go?"
                className="
                    flex-1 bg-transparent outline-none
                    font-manrope text-base md:text-lg text-foreground
                    placeholder:text-foreground/40 placeholder:font-light
                "
                aria-label="Search destinations"
            />
            {query && (
                <button
                    type="submit"
                    className="
                        p-2.5 rounded-full bg-primary/10 
                        hover:bg-primary/20 transition-colors
                    "
                    aria-label="Search"
                >
                    <ChevronRight className="w-5 h-5 text-primary" strokeWidth={2} />
                </button>
            )}
        </form>
    );
};

// =============================================================================
// COMPONENT: PlaceCard
// =============================================================================

const PlaceCard = ({ place }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Link
            to={`/place/${place.id}`}
            className="
                relative flex-shrink-0 w-[280px] md:w-[320px]
                snap-start scroll-ml-5
                group cursor-pointer
                block
            "
        >
            {/* Image Container with 3:4 Aspect Ratio */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary/5">
                {/* Skeleton loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />
                )}

                <img
                    src={place.image}
                    alt={place.title}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-all duration-500 ease-out
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        group-hover:scale-105 group-active:scale-105
                    `}
                />

                {/* Gradient Overlay */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-t from-foreground/60 via-transparent to-transparent
                    opacity-70 group-hover:opacity-90 transition-opacity duration-300
                " />

                {/* Category Tag */}
                <div className="
                    absolute top-4 left-4 
                    px-3 py-1.5 rounded-full
                    bg-white/80 backdrop-blur-sm
                    text-xs font-manrope font-medium text-foreground/80
                ">
                    {place.category}
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className="
                        absolute top-4 right-4 
                        p-2 rounded-full
                        bg-white/80 backdrop-blur-sm
                        hover:bg-white transition-colors duration-200
                    "
                    aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart
                        className={`
                            w-4 h-4 transition-all duration-300
                            ${isLiked ? 'fill-accent text-accent scale-110' : 'text-foreground/60'}
                        `}
                        strokeWidth={1.5}
                    />
                </button>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-tenor text-lg text-white mb-1 leading-tight">
                        {place.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-light">
                            {place.location}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// =============================================================================
// COMPONENT: Header
// =============================================================================

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: "About", href: "#about", isRoute: false },
        { label: "Weather", href: "/weather", isRoute: true },
        { label: "Destinations", href: "#destinations", isRoute: false },
        { label: "Contact", href: "#contact", isRoute: false },
    ];

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-50
                transition-all duration-300 ease-out
                ${scrolled
                    ? 'bg-white/70 backdrop-blur-md shadow-sm'
                    : 'bg-transparent'
                }
            `}
            role="banner"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className={`font-tenor text-xl md:text-2xl tracking-wide transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'
                        }`}
                    aria-label="Dalat Vibe Home"
                >
                    Dalat Vibe
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <Link
                                key={link.label}
                                to={link.href}
                                className={`font-manrope text-sm transition-colors ${scrolled
                                    ? 'text-foreground/70 hover:text-primary'
                                    : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`font-manrope text-sm transition-colors ${scrolled
                                    ? 'text-foreground/70 hover:text-primary'
                                    : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </a>
                        )
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`
                        md:hidden p-2 -mr-2 rounded-full
                        transition-colors
                        ${scrolled ? 'hover:bg-primary/5' : 'hover:bg-white/10'}
                    `}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? (
                        <X className={`w-5 h-5 ${scrolled ? 'text-foreground' : 'text-white'}`} strokeWidth={1.5} />
                    ) : (
                        <Menu className={`w-5 h-5 ${scrolled ? 'text-foreground' : 'text-white'}`} strokeWidth={1.5} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="
                    md:hidden bg-white/95 backdrop-blur-md border-t border-foreground/5
                    animate-fade-in-up
                ">
                    <div className="max-w-7xl mx-auto px-5 py-6 space-y-4">
                        {navLinks.map((link) => (
                            link.isRoute ? (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="block font-manrope text-foreground/80 hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block font-manrope text-foreground/80 hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
};

// =============================================================================
// COMPONENT: HeroSection (Cinematic Split-Layout: Text Left, Weather Right)
// =============================================================================

const HeroSection = () => {
    return (
        <section
            className="relative w-full"
            aria-labelledby="hero-title"
        >
            {/* Full-Width Background Image */}
            <div className="relative w-full h-[85vh] md:h-[90vh] lg:h-[95vh] min-h-[600px]">
                <img
                    src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=1920&h=1080&fit=crop&crop=center"
                    alt="Misty mountains and pine forests of Dalat, Vietnam"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Strong Dark Overlay for maximum text readability */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Warm Accent Gradient - subtle overlay */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-r from-primary/5 via-transparent to-accent/5
                    mix-blend-overlay
                " />

                {/* Content Container - Cinematic Wide Layout */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-10 md:px-16 lg:px-20">
                        {/* Split Layout: Text Left | Weather Right */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">

                            {/* LEFT SIDE: The Slogan (Majestic & Clean) */}
                            <div className="flex-1 max-w-2xl order-2 md:order-1">
                                <h1
                                    id="hero-title"
                                    className="
                                        font-tenor text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                                        leading-[1.1] text-white
                                        whitespace-pre-line
                                        animate-fade-in-up
                                        drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                                    "
                                    style={{ animationDelay: '0.1s' }}
                                >
                                    {`Discover the\nMisty Highlands`}
                                </h1>

                                <p
                                    className="
                                        font-manrope font-light text-lg md:text-xl text-white/85 
                                        mt-6 md:mt-8 leading-relaxed
                                        max-w-lg
                                        animate-fade-in-up
                                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                                    "
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    Where French colonial charm meets Vietnamese soul.
                                </p>
                            </div>

                            {/* RIGHT SIDE: The Weather Column (Vertical & Bold) - Clickable */}
                            <Link
                                to="/weather"
                                className="
                                    flex-shrink-0 order-1 md:order-2
                                    hover:scale-105 transition-transform duration-300
                                    cursor-pointer
                                "
                                style={{ animationDelay: '0.3s' }}
                                aria-label="View detailed weather forecast"
                            >
                                <WeatherColumn />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: CuratedSection
// =============================================================================

const CuratedSection = ({ title, subtitle, places }) => {
    return (
        <section
            className="py-10 md:py-16"
            aria-label={title}
            id="destinations"
        >
            {/* Section Header */}
            <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mb-6 md:mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
                    <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                        {subtitle}
                    </span>
                </div>
                <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                    {title}
                </h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                className="
          flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory
          scrollbar-hide px-5 md:px-8 lg:px-12 pb-2
        "
                role="region"
                aria-label="Scroll through recommended places"
            >
                {places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                ))}

                {/* "See More" Card */}
                <div className="
          flex-shrink-0 w-[200px] md:w-[240px] snap-start
          flex items-center justify-center
          rounded-2xl border-2 border-dashed border-primary/20
          bg-primary/5
          cursor-pointer hover:bg-primary/10 transition-colors
        ">
                    <div className="text-center px-6">
                        <ChevronRight className="w-8 h-8 text-primary/60 mx-auto mb-2" strokeWidth={1.5} />
                        <span className="font-manrope text-sm text-primary/80">
                            Explore all<br />destinations
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: MapSection
// =============================================================================

const MapSection = () => {
    return (
        <section
            className="py-10 md:py-16 px-5 md:px-8 lg:px-12"
            aria-label="Interactive Map"
            id="contact"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Map className="w-4 h-4 text-accent" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                            Location
                        </span>
                    </div>
                    <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                        Explore Dalat City
                    </h2>
                    <p className="font-manrope text-sm text-foreground/60 mt-2">
                        Interactive Map of Key Locations & Attractions
                    </p>
                </div>

                {/* Google Maps Embed - Zoomed to Dalat City Center (Xuan Huong Lake area) */}
                <div className="rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7812.123456789!2d108.4378!3d11.9404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112d959f88991%3A0x9c30ef02c36e7b25!2sXuan%20Huong%20Lake!5e0!3m2!1sen!2s!4v1703462400000!5m2!1sen!2s&z=15"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Map of Dalat City Center, Vietnam"
                        className="w-full h-96"
                    />
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: Footer (Compact & Professional)
// =============================================================================

const Footer = () => {
    const exploreLinks = [
        { label: "Weather Curation", href: "#weather" },
        { label: "Hidden Spots", href: "#hidden-spots" },
        { label: "Local Food", href: "#food" },
        { label: "Accommodations", href: "#stay" },
    ];

    const officialResources = [
        { label: "Visit Vietnam (Official)", href: "https://vietnam.travel", external: true },
        { label: "Dalat People's Committee", href: "https://dalat.lamdong.gov.vn", external: true },
        { label: "Lam Dong Tourism", href: "https://lamdong.gov.vn", external: true },
        { label: "Emergency Contacts", href: "#emergency", external: false },
    ];

    return (
        <footer
            className="bg-[#2C5F48] text-white"
            role="contentinfo"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-10">
                {/* Footer Grid - Compact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

                    {/* Column 1: Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <a href="/" className="font-tenor text-xl text-white tracking-wide">
                            Dalat Vibe
                        </a>
                        <p className="font-manrope text-xs text-white/60 mt-2 leading-relaxed max-w-xs">
                            Curated travel for the misty soul. Discover hidden gems and authentic experiences in Vietnam's enchanting highlands.
                        </p>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Explore
                        </h3>
                        <ul className="space-y-2">
                            {exploreLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="font-manrope text-xs text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Official Resources */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Official Resources
                        </h3>
                        <ul className="space-y-2">
                            {officialResources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="font-manrope text-xs text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.external && (
                                            <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Creator */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Creator
                        </h3>
                        <p className="font-manrope text-xs text-white/60 leading-relaxed">
                            Designed & Developed by<br />
                            <span className="text-white/80">Hallym University</span> × <span className="text-white/80">Dalat University</span>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar - Tight */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <p className="font-manrope text-xs text-white/50">
                            © 2025 <span className="text-white/70">Hallym University x Dalat University</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#privacy" className="font-manrope text-xs text-white/40 hover:text-white/70 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="font-manrope text-xs text-white/40 hover:text-white/70 transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

// =============================================================================
// COMPONENT: HomePage
// =============================================================================

const HomePage = () => {
    const handleSearch = (query) => {
        // TODO: Connect to AI search backend
        console.log('Searching for:', query);
    };

    return (
        <>
            <main role="main">
                <HeroSection />

                {/* Floating Search Bar - Wide Desktop Style */}
                <div className="px-5 md:px-8 lg:px-12 -mt-10 md:-mt-12 relative z-10 max-w-3xl mx-auto">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* Curated Recommendations */}
                <div className="mt-12 md:mt-16">
                    <CuratedSection
                        title="Curated for You"
                        subtitle="AI Picks"
                        places={recommendedPlaces}
                    />
                </div>

                {/* Interactive Map Section */}
                <MapSection />
            </main>
        </>
    );
};

// =============================================================================
// MAIN APP COMPONENT WITH ROUTING
// =============================================================================

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Header />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/place/:id" element={<DetailPage />} />
                </Routes>

                <Footer />

                {/* Global Floating Chat Widget */}
                <ChatWidget />
            </div>
        </BrowserRouter>
    );
}

export default App;
