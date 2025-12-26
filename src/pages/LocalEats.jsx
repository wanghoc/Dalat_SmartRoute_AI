import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Utensils,
    MapPin,
    Star,
    ArrowLeft,
    Clock
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
// Mock Data - Local Hidden Gems
// =============================================================================

const localEats = [
    {
        id: 1,
        name: "Bánh Căn Cô Hương",
        specialty: "Bánh Căn",
        description: "Miniature rice cakes with quail eggs, beloved by locals for 30+ years",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
        rating: 4.9,
        priceRange: "₫",
        location: "Phan Đình Phùng Street",
        hours: "6:00 AM - 10:00 AM"
    },
    {
        id: 2,
        name: "Kem Bơ Thanh Thảo",
        specialty: "Kem Bơ",
        description: "Legendary avocado ice cream - a Dalat signature since 1985",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop",
        rating: 4.8,
        priceRange: "₫",
        location: "Near Dalat Market",
        hours: "10:00 AM - 10:00 PM"
    },
    {
        id: 3,
        name: "Bánh Ướt Lòng Gà Bà Năm",
        specialty: "Bánh Ướt Lòng Gà",
        description: "Steamed rice rolls with chicken organs - local breakfast staple",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
        rating: 4.7,
        priceRange: "₫",
        location: "Tang Bat Ho Street",
        hours: "5:30 AM - 9:00 AM"
    },
    {
        id: 4,
        name: "Nem Nướng Bà Hùng",
        specialty: "Nem Nướng",
        description: "Grilled pork sausage wraps - perfect street food experience",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
        rating: 4.6,
        priceRange: "₫₫",
        location: "Hai Bà Trưng Street",
        hours: "2:00 PM - 9:00 PM"
    },
    {
        id: 5,
        name: "Bún Bò Huế Cô Giang",
        specialty: "Bún Bò",
        description: "Spicy beef noodle soup - warming highland comfort food",
        image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop",
        rating: 4.7,
        priceRange: "₫",
        location: "Nguyễn Văn Trỗi",
        hours: "6:00 AM - 2:00 PM"
    },
    {
        id: 6,
        name: "Bánh Tráng Nướng Chợ Đêm",
        specialty: "Bánh Tráng Nướng",
        description: "Vietnamese pizza - crispy rice paper with toppings",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
        rating: 4.5,
        priceRange: "₫",
        location: "Night Market Area",
        hours: "5:00 PM - 11:00 PM"
    },
    {
        id: 7,
        name: "Phở Gà Lâm Viên",
        specialty: "Phở Gà",
        description: "Chicken pho with highland herbs - soul-warming bowls",
        image: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=600&h=400&fit=crop",
        rating: 4.6,
        priceRange: "₫",
        location: "Lâm Viên Square",
        hours: "6:00 AM - 12:00 PM"
    },
    {
        id: 8,
        name: "Sữa Đậu Nành Nóng",
        specialty: "Hot Soy Milk",
        description: "Fresh hot soy milk with youtiao - morning ritual",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop",
        rating: 4.4,
        priceRange: "₫",
        location: "City Center Streets",
        hours: "5:00 AM - 9:00 AM"
    },
    {
        id: 9,
        name: "Xôi Gà Chợ Đà Lạt",
        specialty: "Xôi Gà",
        description: "Sticky rice with shredded chicken - hearty morning meal",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
        rating: 4.5,
        priceRange: "₫",
        location: "Dalat Central Market",
        hours: "5:00 AM - 10:00 AM"
    }
];

// =============================================================================
// Restaurant Card Component
// =============================================================================

const RestaurantCard = ({ restaurant }) => {
    return (
        <motion.div
            variants={fadeInUp}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-manrope font-bold text-sm text-slate-900">
                        {restaurant.priceRange}
                    </span>
                </div>
                {/* Specialty Tag */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-manrope text-xs text-white">
                        {restaurant.specialty}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-tenor text-xl text-white mb-2">
                    {restaurant.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-manrope text-sm text-white/70">{restaurant.rating}</span>
                </div>

                {/* Description */}
                <p className="font-manrope text-sm text-white/60 leading-relaxed mb-4">
                    {restaurant.description}
                </p>

                {/* Meta */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/40">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-manrope text-xs">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-manrope text-xs">{restaurant.hours}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// =============================================================================
// Main Page Component
// =============================================================================

const LocalEats = () => {
    return (
        <article className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-slate-950 to-slate-950" />

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
                            <Utensils className="w-5 h-5 text-white/60" />
                            <span className="font-manrope text-sm text-white/50 uppercase tracking-[0.3em]">
                                Local Discoveries
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-tenor text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
                        >
                            Authentic Flavors
                            <span className="block text-white/60">of the Highlands</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="font-manrope font-light text-lg text-slate-400 max-w-2xl"
                        >
                            Hidden gems where locals actually eat. No tourist traps,
                            just genuine Dalat culinary traditions passed down through generations.
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {localEats.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </motion.div>
                </div>
            </section>
        </article>
    );
};

export default LocalEats;
