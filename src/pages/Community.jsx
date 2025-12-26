import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smile,
    Meh,
    Frown,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ThumbsUp,
    Globe,
    Star,
    PenLine
} from 'lucide-react';
import { reviewsPart1, reviewsPart2 } from '../data/mockReviews';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import WritePostModal from '../components/WritePostModal';

// =============================================================================
// Constants
// =============================================================================

const ITEMS_PER_PAGE = 20;
const CUSTOM_REVIEWS_KEY = 'dalat_custom_reviews';

// =============================================================================
// Combine all reviews
// =============================================================================

const staticReviews = [...reviewsPart1, ...reviewsPart2];

// =============================================================================
// Filter Types
// =============================================================================

const FILTERS = {
    ALL: 'all',
    POSITIVE: 'positive',
    NEUTRAL: 'neutral',
    CRITICAL: 'critical'
};

// =============================================================================
// Helper Functions
// =============================================================================

const getSentimentIcon = (rating) => {
    if (typeof rating === 'string') {
        if (rating === 'positive') return Smile;
        if (rating === 'neutral') return Meh;
        return Frown;
    }
    if (rating >= 4) return Smile;
    if (rating >= 3) return Meh;
    return Frown;
};

const getRatingNumber = (rating) => {
    if (typeof rating === 'number') return rating;
    if (rating === 'positive') return 5;
    if (rating === 'neutral') return 3;
    return 2;
};

const getLanguageLabel = (lang) => {
    const labels = {
        ko: '한국어',
        en: 'English',
        vi: 'Tiếng Việt',
        ja: '日本語'
    };
    return labels[lang] || lang;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatIndex = (num) => {
    return num.toString().padStart(2, '0');
};

// =============================================================================
// Animation Variants
// =============================================================================

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const rowVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 }
};

// =============================================================================
// ReviewRow Component
// =============================================================================

const ReviewRow = ({ review, displayIndex, isExpanded, onToggle }) => {
    const SentimentIcon = getSentimentIcon(review.rating);
    const ratingNum = getRatingNumber(review.rating);

    return (
        <motion.div
            layout
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`border-b border-white/5 last:border-b-0 ${review.isCustom ? 'bg-slate-800/30' : ''}`}
        >
            {/* Main Row - Clickable */}
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
            >
                {/* Display Index */}
                <span className="font-mono font-bold text-white text-sm w-10 flex-shrink-0">
                    {formatIndex(displayIndex)}
                </span>

                {/* Avatar */}
                {review.avatar || review.authorAvatar ? (
                    <img
                        src={review.avatar || review.authorAvatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">
                            {review.author?.charAt(0) || '?'}
                        </span>
                    </div>
                )}

                {/* Author & Preview */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-manrope font-medium text-white text-sm">
                            {review.author}
                        </span>
                        {review.isCustom && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800/50 text-xs text-slate-200">
                                New
                            </span>
                        )}
                        <span className="font-manrope text-xs text-white/40">
                            {formatDate(review.date)}
                        </span>
                    </div>
                    <p className="font-manrope text-sm text-white/60 truncate">
                        {review.title || review.content}
                    </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < ratingNum ? 'text-white fill-white' : 'text-white/20'}`}
                        />
                    ))}
                </div>

                {/* Sentiment Icon */}
                <SentimentIcon className="w-5 h-5 text-white/60 flex-shrink-0" />

                {/* Expand Arrow */}
                <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        variants={expandVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2 pl-28">
                            {/* Title if exists */}
                            {review.title && (
                                <h3 className="font-tenor text-lg text-white mb-2">{review.title}</h3>
                            )}

                            {/* Full Content */}
                            <p className="font-manrope text-base text-white/80 leading-relaxed mb-4">
                                {review.content}
                            </p>

                            {/* Meta Row */}
                            <div className="flex items-center gap-6 text-sm">
                                {/* Language */}
                                <div className="flex items-center gap-2 text-white/40">
                                    <Globe className="w-4 h-4" />
                                    <span className="font-manrope">{getLanguageLabel(review.language)}</span>
                                </div>

                                {/* Helpful Count */}
                                {review.helpful !== undefined && (
                                    <div className="flex items-center gap-2 text-white/40">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="font-manrope">{review.helpful} found helpful</span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {review.tags && review.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {review.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs font-manrope"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// =============================================================================
// Pagination Component
// =============================================================================

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-1">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            w-10 h-10 rounded-lg font-manrope text-sm font-medium transition-all
                            ${currentPage === page
                                ? 'bg-white text-slate-950'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};

// =============================================================================
// Filter Button Component
// =============================================================================

const FilterButton = ({ icon: Icon, label, count, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-white/70 hover:bg-white/5'
                }
            `}
        >
            <Icon className="w-5 h-5" />
            <span className="font-manrope text-sm">
                {count} {label}
            </span>
        </button>
    );
};

// =============================================================================
// Main Community Page Component
// =============================================================================

const Community = () => {
    const { user, isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
    const [customReviews, setCustomReviews] = useState([]);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [writeModalOpen, setWriteModalOpen] = useState(false);

    // Load custom reviews from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CUSTOM_REVIEWS_KEY);
            if (stored) {
                setCustomReviews(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load custom reviews:', e);
        }
    }, []);

    // Merge custom reviews with static reviews (custom reviews first)
    const allReviews = useMemo(() => {
        return [...customReviews, ...staticReviews];
    }, [customReviews]);

    // Calculate review counts
    const reviewCounts = useMemo(() => ({
        positive: allReviews.filter(r => getRatingNumber(r.rating) >= 4).length,
        neutral: allReviews.filter(r => getRatingNumber(r.rating) === 3).length,
        critical: allReviews.filter(r => getRatingNumber(r.rating) <= 2).length
    }), [allReviews]);

    // Filter reviews based on active filter
    const filteredReviews = useMemo(() => {
        switch (activeFilter) {
            case FILTERS.POSITIVE:
                return allReviews.filter(r => getRatingNumber(r.rating) >= 4);
            case FILTERS.NEUTRAL:
                return allReviews.filter(r => getRatingNumber(r.rating) === 3);
            case FILTERS.CRITICAL:
                return allReviews.filter(r => getRatingNumber(r.rating) <= 2);
            default:
                return allReviews;
        }
    }, [activeFilter, allReviews]);

    // Calculate total pages based on filtered reviews
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

    // Calculate current page reviews
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReviews = filteredReviews.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setExpandedId(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        if (activeFilter === filter) {
            setActiveFilter(FILTERS.ALL);
        } else {
            setActiveFilter(filter);
        }
        setCurrentPage(1);
        setExpandedId(null);
    };

    // Toggle expanded row
    const handleToggle = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Handle write button click
    const handleWriteClick = () => {
        if (!isAuthenticated || !user) {
            alert('Please login to write a review.');
            setLoginModalOpen(true);
            return;
        }
        setWriteModalOpen(true);
    };

    // Handle new review submission
    const handleNewReview = (newReview) => {
        const updatedReviews = [newReview, ...customReviews];
        setCustomReviews(updatedReviews);
        localStorage.setItem(CUSTOM_REVIEWS_KEY, JSON.stringify(updatedReviews));
        setCurrentPage(1);
        setActiveFilter(FILTERS.ALL);
    };

    // Calculate display index (descending)
    const getDisplayIndex = (arrayIndex) => {
        return filteredReviews.length - ((currentPage - 1) * ITEMS_PER_PAGE + arrayIndex);
    };

    return (
        <>
            <article className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
                {/* Container matching global header width */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header with Write Button */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="font-manrope text-xs font-light text-white/40 uppercase tracking-[0.3em] mb-4">
                                Traveler Stories
                            </p>
                            <h1 className="font-tenor text-4xl md:text-5xl leading-tight">
                                Community Reviews
                            </h1>
                        </div>

                        {/* Write Review Button */}
                        <button
                            onClick={handleWriteClick}
                            className="
                                inline-flex items-center gap-2
                                px-6 py-3 rounded-xl
                                bg-slate-800 hover:bg-slate-700
                                text-white font-medium
                                transition-all active:scale-95
                                shadow-lg shadow-slate-900/30
                            "
                        >
                            <PenLine className="w-5 h-5" />
                            Write a Review
                        </button>
                    </header>

                    {/* Interactive Filter Bar */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/10">
                        <FilterButton
                            icon={Smile}
                            label="Positive"
                            count={reviewCounts.positive}
                            isActive={activeFilter === FILTERS.POSITIVE}
                            onClick={() => handleFilterChange(FILTERS.POSITIVE)}
                        />
                        <FilterButton
                            icon={Meh}
                            label="Neutral"
                            count={reviewCounts.neutral}
                            isActive={activeFilter === FILTERS.NEUTRAL}
                            onClick={() => handleFilterChange(FILTERS.NEUTRAL)}
                        />
                        <FilterButton
                            icon={Frown}
                            label="Critical"
                            count={reviewCounts.critical}
                            isActive={activeFilter === FILTERS.CRITICAL}
                            onClick={() => handleFilterChange(FILTERS.CRITICAL)}
                        />

                        {activeFilter !== FILTERS.ALL && (
                            <button
                                onClick={() => handleFilterChange(activeFilter)}
                                className="ml-auto font-manrope text-xs text-white/40 hover:text-white/70 transition-colors"
                            >
                                Clear filter ✕
                            </button>
                        )}
                    </div>

                    {/* Review List */}
                    <motion.div
                        key={`${currentPage}-${activeFilter}-${customReviews.length}`}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden"
                    >
                        {currentReviews.length > 0 ? (
                            <AnimatePresence mode="wait">
                                {currentReviews.map((review, index) => (
                                    <ReviewRow
                                        key={review.id}
                                        review={review}
                                        displayIndex={getDisplayIndex(index)}
                                        isExpanded={expandedId === review.id}
                                        onToggle={() => handleToggle(review.id)}
                                    />
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="font-manrope text-white/40">No reviews match this filter.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </article>

            {/* Modals */}
            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
            <WritePostModal
                isOpen={writeModalOpen}
                onClose={() => setWriteModalOpen(false)}
                onSubmit={handleNewReview}
                user={user}
            />
        </>
    );
};

export default Community;
