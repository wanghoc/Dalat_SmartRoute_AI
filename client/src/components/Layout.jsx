import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

// =============================================================================
// Navigation Links Configuration
// =============================================================================

const navLinks = [
    { key: 'nav.home', label: 'Home', to: "/" },
    { key: 'nav.weather', label: 'Weather', to: "/weather" },
    { key: 'nav.intro', label: 'Dalat', to: "/intro" },
    { key: 'nav.recs', label: 'Curation', to: "/ai-recs" },
    { key: 'nav.local', label: 'Dining', to: "/local-eats" },
    { key: 'nav.community', label: 'Community', to: "/community" },
];

// =============================================================================
// Language Configuration
// =============================================================================

const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
];

// =============================================================================
// Avatar Dropdown Component
// =============================================================================

const AvatarDropdown = ({ user, onLogout }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-slate-400/50 transition-all"
            >
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-[9999]">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-medium text-white text-sm">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => { setIsOpen(false); navigate('/profile'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <User className="w-4 h-4" /> {t('auth.profile')}
                        </button>
                        <button
                            onClick={() => { setIsOpen(false); onLogout(); navigate('/'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> {t('auth.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// Header Component - Deep Navy Premium Theme
// =============================================================================

const Header = () => {
    const { t, i18n } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const langRef = useRef(null);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onClick = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('dalat_lang', code);
        setLangMenuOpen(false);
    };

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/10'
                    : 'bg-white/80 backdrop-blur-sm'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

                    {/* ===== LOGO - NUCLEAR FORCE DEEP GREEN ===== */}
                    <Link
                        to="/"
                        className="font-serif text-xl md:text-2xl transition-colors"
                        style={{ color: scrolled ? '#FFFFFF' : '#2C3E50' }}
                    >
                        Dalat Vibe
                    </Link>

                    {/* ===== NAV LINKS - FORCE DEEP GREEN ===== */}
                    <nav className="hidden md:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.key}
                                to={link.to}
                                className={({ isActive }) => `
                                    relative text-sm font-medium py-1 transition-colors
                                    ${scrolled
                                        ? (isActive ? 'text-slate-300' : 'text-white/70 hover:text-white')
                                        : (isActive ? 'text-[#2C3E50]' : 'text-gray-600 hover:text-[#2C3E50]')
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.label}
                                        <span className={`
                                            absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                                            transition-transform duration-300 origin-left
                                            ${scrolled ? 'bg-slate-300' : 'bg-[#2C3E50]'}
                                            ${isActive ? 'scale-x-100' : 'scale-x-0'}
                                        `} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ===== RIGHT SECTION: CONTROLS ===== */}
                    <div className="flex items-center gap-4 z-50 ml-auto shrink-0">

                        {/* ----- LANGUAGE SWITCHER ----- */}
                        <div ref={langRef} className="relative shrink-0">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className={`
                                    shrink-0 w-10 h-10
                                    flex items-center justify-center
                                    rounded-full transition-all duration-200
                                    ${scrolled
                                        ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700'
                                    }
                                `}
                                aria-label="Change language"
                                style={{ minWidth: '40px', minHeight: '40px', flexShrink: 0 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </button>

                            {/* Language Dropdown */}
                            {langMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-[9999]">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${i18n.language === lang.code
                                                ? 'text-white bg-white/15'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </div>
                                            {i18n.language === lang.code && <Check className="w-4 h-4 text-slate-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ----- AUTH BUTTON ----- */}
                        <div className="hidden md:block shrink-0">
                            {isAuthenticated && user ? (
                                <AvatarDropdown user={user} onLogout={logout} />
                            ) : (
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className={`
                                        shrink-0 px-4 py-2 rounded-full text-sm font-medium
                                        transition-all active:scale-95
                                        ${scrolled
                                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                                        }
                                    `}
                                    style={{ minWidth: '80px', flexShrink: 0 }}
                                >
                                    {t('auth.login')}
                                </button>
                            )}
                        </div>

                        {/* ----- MOBILE MENU TOGGLE ----- */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`md:hidden shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${scrolled ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            style={{ minWidth: '40px', minHeight: '40px', flexShrink: 0 }}
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* ===== MOBILE MENU ===== */}
                <nav className={`md:hidden overflow-hidden transition-all duration-300 bg-slate-950 border-t border-white/10 ${menuOpen ? 'max-h-[700px]' : 'max-h-0'}`}>
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.key}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `block py-3 px-4 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800/20 text-slate-300' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {/* Mobile Language */}
                        <div className="pt-3 mt-3 border-t border-white/10">
                            <p className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider">Language</p>
                            <div className="flex flex-wrap gap-2 px-4">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${i18n.language === lang.code
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {lang.flag} {lang.code.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Auth */}
                        <div className="pt-3 mt-2 border-t border-white/10">
                            {isAuthenticated && user ? (
                                <div className="space-y-2">
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-white/70 hover:bg-white/5">
                                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                                        <span className="font-medium text-white">{user.name}</span>
                                    </Link>
                                    <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-white/70 hover:bg-white/5">
                                        <LogOut className="w-5 h-5" /> {t('auth.logout')}
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => { setLoginModalOpen(true); setMenuOpen(false); }} className="w-full py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700">
                                    {t('auth.login')}
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
};

// =============================================================================
// Footer Component - Premium Charcoal
// =============================================================================

const Footer = () => {
    return (
        <footer className="bg-[#11163B] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <Link to="/" className="font-serif text-2xl text-white hover:text-slate-300 transition-colors">
                        Dalat Vibe
                    </Link>

                    {/* Tagline */}
                    <p className="font-manrope text-sm text-slate-400 text-center">
                        Your Gateway to the Misty Highlands
                    </p>

                    {/* Copyright */}
                    <p className="font-manrope text-sm text-slate-400">
                        © 2025 Dragon Ho. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// =============================================================================
// Layout Component
// =============================================================================

const Layout = ({ children }) => (
    <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
    </div>
);

export default Layout;
export { Header, Footer };
