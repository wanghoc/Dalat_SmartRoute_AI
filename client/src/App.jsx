import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CityIntro from './pages/CityIntro';
import Community from './pages/Community';
import AIRecommendations from './pages/AIRecommendations';
import LocalEats from './pages/LocalEats';
import UserProfile from './pages/UserProfile';
import { AuthProvider } from './context/AuthContext';
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
    Map,
    User,
    LogIn,
    Globe
} from 'lucide-react';

import ChatWidget from './components/ChatWidget';
import SearchBar from './components/SearchBar';
import DetailPage from './pages/Detail';
import Weather from './pages/Weather';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

// =============================================================================
// DUMMY DATA - Replace with API calls in production
// =============================================================================

// Dummy data removed - now fetching from API

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
    const { t, i18n } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get weather tip based on weather ID and language
    const getWeatherTipTranslated = (weatherId) => {
        const isVi = i18n.language === 'vi';
        if (weatherId >= 200 && weatherId < 300) {
            return isVi ? "Có giông bão. Nên ở trong nhà nếu có thể." : "Thunderstorms expected. Stay indoors if possible.";
        } else if (weatherId >= 300 && weatherId < 400) {
            return isVi ? "Mưa phùn nhẹ. Một áo khoác nhẹ là đủ." : "Light drizzle. A light jacket should suffice.";
        } else if (weatherId >= 500 && weatherId < 600) {
            return isVi ? "Đừng quên mang ô." : "Don't forget your umbrella.";
        } else if (weatherId >= 600 && weatherId < 700) {
            return isVi ? "Tuyết hiếm ở Đà Lạt! Mặc thật ấm." : "Rare snow in Dalat! Bundle up warmly.";
        } else if (weatherId >= 700 && weatherId < 800) {
            return isVi ? "Sương mù. Lái xe cẩn thận." : "Misty conditions. Drive carefully.";
        } else if (weatherId === 800) {
            return isVi ? "Ngày đẹp để đi dạo hoặc khám phá." : "Great day for a walk or outdoor exploration.";
        } else if (weatherId > 800) {
            return isVi ? "Trời nhiều mây. Hoàn hảo để tham quan." : "Partly cloudy. Perfect for sightseeing.";
        }
        return isVi ? "Chúc bạn có chuyến thăm Đà Lạt vui vẻ!" : "Enjoy your visit to Dalat!";
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch through backend proxy to protect API key
                const response = await fetch('/api/weather');
                if (!response.ok) throw new Error('Weather data unavailable');
                const data = await response.json();
                setWeather({
                    temp: data.temp,
                    humidity: data.humidity,
                    windSpeed: data.windSpeed,
                    description: capitalizeWords(data.description),
                    weatherId: data.weatherId
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
                    {t('weather.unavailable')}
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
                        {weather.humidity}% {t('weather.humidity')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-manrope text-sm">
                        {weather.windSpeed} m/s {t('weather.wind')}
                    </span>
                </div>
            </div>

            {/* Weather Tip */}
            <p className="
                font-manrope text-xs text-white/60 italic
                mt-6 max-w-[200px]
            ">
                {getWeatherTipTranslated(weather.weatherId)}
            </p>
        </div>
    );
};

// =============================================================================
// COMPONENT: HeroSearchBar (Hybrid Trigger - Used in Hero Section)
// =============================================================================

const HeroSearchBar = ({ onSearch }) => {
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
    const { i18n } = useTranslation();
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isVietnamese = i18n.language === 'vi';

    // Get translated title and location
    const title = isVietnamese && place.titleVi ? place.titleVi : place.title;
    const location = isVietnamese && place.locationVi ? place.locationVi : place.location;

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
                    src={place.image || place.imagePath}
                    alt={title}
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
                    {place.category?.name || place.category}
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
                        {title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-light">
                            {location}
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

const AvatarDropdownHeader = ({ user, onLogout, scrolled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-slate-600/50 transition-all duration-300 bg-slate-700 flex items-center justify-center"
            >
                <User className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-manrope font-medium text-white text-sm">{user.name || user.username}</p>
                        <p className="font-manrope text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-2.5 flex items-center gap-3 font-manrope text-sm text-white/80 hover:bg-white/10"
                        >
                            <User className="w-4 h-4" /> My Profile
                        </Link>
                        <button
                            onClick={() => { onLogout(); setIsOpen(false); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 font-manrope text-sm text-white/80 hover:bg-white/10"
                        >
                            <LogIn className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { t, i18n } = useTranslation();

    // Language state (Vi/En toggle)
    const [language, setLanguage] = useState(i18n.language === 'vi' ? 'vi' : 'en');

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'vi' : 'en';
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: t('nav.home'), to: "/" },
        { label: t('nav.weather'), to: "/weather" },
        { label: t('nav.intro'), to: "/intro" },
        { label: t('nav.recs'), to: "/ai-recs" },
        { label: t('nav.local'), to: "/local-eats" },
        { label: t('nav.community'), to: "/community" },
    ];

    return (
        <>
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
                    {/* Logo - NUCLEAR FORCE DEEP GREEN */}
                    <Link
                        to="/"
                        className="font-tenor text-xl md:text-2xl tracking-wide transition-colors duration-300"
                        style={{ color: scrolled ? '#2C3E50' : '#FFFFFF' }}
                        aria-label="Dalat Vibe Home"
                    >
                        Dalat Vibe
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.to ? (
                                <NavLink
                                    key={link.label}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        relative font-manrope text-sm py-1
                                        transition-colors duration-300
                                        ${scrolled
                                            ? isActive
                                                ? 'text-[#2C3E50]'    // Deep Green active
                                                : 'text-foreground/70 hover:text-[#2C3E50]'  // Deep Green hover
                                            : isActive
                                                ? 'text-white'
                                                : 'text-white/80 hover:text-white'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.label}
                                            <span className={`
                                                absolute bottom-0 left-0 right-0 h-0.5
                                                rounded-full transition-transform duration-300 origin-left
                                                ${scrolled ? 'bg-[#2C3E50]' : 'bg-white'}
                                                ${isActive ? 'scale-x-100' : 'scale-x-0'}
                                            `} />
                                        </>
                                    )}
                                </NavLink>
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

                    {/* Auth Controls */}
                    <div className="flex items-center gap-3">
                        {/* Smart Search Bar (left of language toggle) */}
                        <div className="hidden md:block">
                            <SearchBar scrolled={scrolled} />
                        </div>

                        {/* Language Toggle Button (Vi/En) */}
                        <button
                            onClick={toggleLanguage}
                            className={`
                                hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                font-manrope text-xs font-medium transition-all
                                ${scrolled
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                }
                            `}
                            aria-label="Toggle language"
                        >
                            <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{language === 'en' ? 'EN' : 'VI'}</span>
                        </button>

                        {isAuthenticated && user ? (
                            <AvatarDropdownHeader user={user} onLogout={logout} scrolled={scrolled} />
                        ) : (
                            <button
                                onClick={() => setLoginModalOpen(true)}
                                className={`
                                    hidden md:flex items-center gap-2 px-4 py-2 rounded-full
                                    font-manrope text-sm font-medium transition-all
                                    ${scrolled
                                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                                    }
                                `}
                            >
                                Login
                            </button>
                        )}

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
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <nav className="md:hidden bg-white/95 backdrop-blur-md border-t border-foreground/5 animate-fade-in-up">
                        <div className="max-w-7xl mx-auto px-5 py-6 space-y-4">
                            {navLinks.map((link) => (
                                link.to ? (
                                    <NavLink
                                        key={link.label}
                                        to={link.to}
                                        onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) => `
                                            block font-manrope py-3 px-4 rounded-xl
                                            transition-colors duration-200
                                            ${isActive
                                                ? 'bg-slate-800/10 text-slate-700'
                                                : 'text-foreground/80 hover:bg-gray-50 hover:text-primary'
                                            }
                                        `}
                                    >
                                        {link.label}
                                    </NavLink>
                                ) : (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block font-manrope text-foreground/80 hover:text-primary transition-colors py-3 px-4"
                                    >
                                        {link.label}
                                    </a>
                                )
                            ))}

                            {/* Mobile Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center justify-between w-full py-3 px-4 rounded-xl text-foreground/80 hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-3 font-manrope">
                                    <Globe className="w-5 h-5" strokeWidth={1.5} />
                                    Language
                                </span>
                                <span className="font-manrope font-medium text-slate-600">
                                    {language === 'en' ? 'English' : 'Tiếng Việt'}
                                </span>
                            </button>

                            {/* Mobile Auth */}
                            <div className="pt-4 border-t border-gray-100">
                                {isAuthenticated && user ? (
                                    <div className="space-y-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 py-3 px-4 rounded-xl text-foreground/80 hover:bg-gray-50"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                                                <User className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <span className="font-manrope font-medium">{user.name || user.username}</span>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setMenuOpen(false); }}
                                            className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-foreground/80 hover:bg-gray-50 font-manrope"
                                        >
                                            <LogIn className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setLoginModalOpen(true); setMenuOpen(false); }}
                                        className="w-full py-3 bg-slate-800 text-white font-manrope font-medium rounded-xl hover:bg-slate-700 transition-colors"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </nav>
                )}
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSwitchToRegister={() => {
                    setLoginModalOpen(false);
                    setRegisterModalOpen(true);
                }}
            />

            {/* Register Modal */}
            <RegisterModal
                isOpen={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                onSwitchToLogin={() => {
                    setRegisterModalOpen(false);
                    setLoginModalOpen(true);
                }}
            />
        </>
    );
};

// =============================================================================
// COMPONENT: HeroSection (Cinematic Split-Layout: Text Left, Weather Right)
// =============================================================================

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section
            className="relative w-full"
            aria-labelledby="hero-title"
        >
            {/* Full-Width Background Image */}
            <div className="relative w-full h-[85vh] md:h-[90vh] lg:h-[95vh] min-h-[600px]">
                <img
                    src="https://antimatter.vn/wp-content/uploads/2022/06/hinh-anh-da-lat.jpg"
                    alt="Dalat, Vietnam"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Strong Dark Overlay for maximum text readability */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Cool Misty Gradient - Deep blue tone */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-transparent
                    mix-blend-multiply
                " />

                {/* Content Container - Aligned with Header */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Split Layout: Text Left | Weather Right */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">

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
                                    {t('hero.title')}
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
                                    {t('hero.subtitle')}
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

const CuratedSection = ({ title, subtitle, places, viewAllLink }) => {
    const { t } = useTranslation();

    return (
        <section
            className="py-10 md:py-16"
            aria-label={title}
            id="destinations"
        >
            {/* Section Header with View All Link */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                    <div>
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
                    {viewAllLink && (
                        <Link
                            to={viewAllLink}
                            className="font-manrope text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            {t('sections.viewAllRecs')}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Horizontal Scroll Container - No See More Card */}
            <div
                className="
          flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory
          scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2
        "
                role="region"
                aria-label="Scroll through recommended places"
            >
                {places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                ))}
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: MapSection
// =============================================================================

const MapSection = () => {
    const { t } = useTranslation();

    return (
        <section
            className="py-10 md:py-16"
            aria-label="Interactive Map"
            id="contact"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Map className="w-4 h-4 text-accent" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                            {t('sections.location')}
                        </span>
                    </div>
                    <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                        {t('sections.exploreCity')}
                    </h2>
                    <p className="font-manrope text-sm text-foreground/60 mt-2">
                        {t('sections.mapDescription')}
                    </p>
                </div>

                {/* Google Maps Embed - SATELLITE/HYBRID Mode for terrain texture */}
                <div className="rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15624.246913578!2d108.4378!3d11.9404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112d959f88991%3A0x9c30ef02c36e7b25!2sXuan%20Huong%20Lake!5e1!3m2!1sen!2s!4v1703462400000!5m2!1sen!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Satellite Map of Dalat City Center, Vietnam"
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
            className="bg-[#11163B] text-white"
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
                            <span className="text-white/80">Dragon Ho</span>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar - Tight */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <p className="font-manrope text-xs text-white/50">
                            © 2025 <span className="text-white/70">Dragon Ho</span>. All rights reserved.
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
// COMPONENT: LocalEatsSection (Static 3x2 Grid)
// =============================================================================

// localEatsData - Now fetched from API in LocalEatsSection

const LocalEatsSection = () => {
    const { t, i18n } = useTranslation();
    const [localEats, setLocalEats] = useState([]);
    const [loading, setLoading] = useState(true);
    const isVietnamese = i18n.language === 'vi';

    useEffect(() => {
        const fetchLocalEats = async () => {
            try {
                // Fetch all places and filter for food-related categories
                const response = await fetch('/api/places');
                if (response.ok) {
                    const data = await response.json();
                    // Filter for Street Food and Restaurant categories, limit to 6
                    const foodPlaces = data.filter(place =>
                        place.category?.name === 'Street Food' ||
                        place.category?.name === 'Restaurant'
                    ).slice(0, 6);
                    setLocalEats(foodPlaces);
                }
            } catch (err) {
                console.error('Failed to fetch local eats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalEats();
    }, []);

    if (loading) {
        return (
            <section className="py-10 md:py-16" aria-label="Local Hidden Gems">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 md:py-16" aria-label="Local Hidden Gems">
            {/* Section Header with View All Link */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-accent" strokeWidth={1.5} />
                            <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                                {t('sections.localFavorites')}
                            </span>
                        </div>
                        <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                            {t('sections.localGemsTitle')}
                        </h2>
                    </div>
                    <Link
                        to="/local-eats"
                        className="font-manrope text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                        {t('sections.discoverLocalEats')}
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Dynamic Grid - Fetched from API */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {localEats.map((item) => (
                        <Link
                            key={item.id}
                            to={`/place/${item.id}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer block"
                        >
                            <img
                                src={item.imagePath}
                                alt={isVietnamese && item.titleVi ? item.titleVi : item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-tenor text-lg text-white mb-1">
                                    {isVietnamese && item.titleVi ? item.titleVi : item.title}
                                </h3>
                                <p className="font-manrope text-sm text-white/70">
                                    {(isVietnamese && item.descriptionVi ? item.descriptionVi : item.description)?.substring(0, 60)}...
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: HomePage
// =============================================================================

const HomePage = () => {
    const { t } = useTranslation();
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedPlaces = async () => {
            try {
                const response = await fetch('/api/places');
                if (response.ok) {
                    const data = await response.json();
                    // Transform data to match PlaceCard expected format and take first 6
                    const transformed = data.slice(0, 6).map(place => ({
                        id: place.id,
                        title: place.title,
                        titleVi: place.titleVi,
                        location: place.location,
                        locationVi: place.locationVi,
                        image: place.imagePath,
                        description: place.description,
                        category: place.category?.name || 'Attraction'
                    }));
                    setRecommendedPlaces(transformed);
                }
            } catch (err) {
                console.error('Failed to fetch places:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendedPlaces();
    }, []);

    const handleSearch = (query) => {
        // TODO: Connect to AI search backend
        console.log('Searching for:', query);
    };

    return (
        <>
            <main role="main">
                <HeroSection />

                {/* Section 1: Curated Recommendations (Weather-Based) */}
                <div className="mt-16 md:mt-20">
                    {loading ? (
                        <section className="py-10 md:py-16">
                            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                                <div className="flex gap-4 md:gap-6 overflow-x-auto">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <CuratedSection
                            title={t('sections.forecastCuration')}
                            subtitle={t('sections.aiPicks')}
                            places={recommendedPlaces}
                            viewAllLink="/ai-recs"
                        />
                    )}
                </div>

                {/* Section 2: Local Hidden Gems (Dynamic from API) */}
                <LocalEatsSection />

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
            <AuthProvider>
                <div className="min-h-screen bg-background">
                    <Header />

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/intro" element={<CityIntro />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/ai-recs" element={<AIRecommendations />} />
                        <Route path="/local-eats" element={<LocalEats />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/place/:id" element={<DetailPage />} />
                    </Routes>

                    <Footer />

                    {/* Global Floating Chat Widget */}
                    <ChatWidget />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
