import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    Phone,
    Share2,
    Bookmark,
    Clock,
    MapPin,
    Sparkles,
    Navigation
} from 'lucide-react';

// =============================================================================
// DUMMY DATA - In production, fetch from API based on :id param
// =============================================================================

const placeDetails = {
    1: {
        id: 1,
        title: "Langbiang Mountain",
        location: "Lạc Dương District, Dalat",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.8,
        reviewCount: 1247,
        category: "Nature",
        isOpen: true,
        openHours: "6:00 AM - 6:00 PM",
        description: "Rising majestically to 2,167 meters above sea level, Langbiang Mountain stands as the rooftop of the Central Highlands. Named after a legendary love story between K'Lang and Ho Biang, this iconic peak offers an unforgettable journey through diverse ecosystems—from pine forests at the base to alpine meadows at the summit.",
        designerTip: "Arrive before 6:30 AM to catch the sunrise above the clouds. The morning mist creates an ethereal atmosphere that disappears by mid-morning. Bring a light jacket—temperatures drop significantly at the summit.",
        coordinates: { lat: 12.0459, lng: 108.4412 }
    },
    2: {
        id: 2,
        title: "Hồ Tuyền Lâm",
        location: "Trại Mát Ward, Dalat",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.7,
        reviewCount: 892,
        category: "Lake",
        isOpen: true,
        openHours: "5:00 AM - 7:00 PM",
        description: "Tuyền Lâm Lake is a serene artificial lake nestled among rolling pine-covered hills. Its crystal-clear waters reflect the surrounding forests, creating a mirror-like surface that captivates photographers and nature lovers alike. The lake's peaceful atmosphere makes it perfect for contemplative mornings and romantic sunset strolls.",
        designerTip: "Rent a kayak in the early afternoon when the light is softest. The small islands in the middle of the lake offer secluded spots for a peaceful picnic away from the crowds.",
        coordinates: { lat: 11.9165, lng: 108.4231 }
    },
    3: {
        id: 3,
        title: "The Married Café",
        location: "Phường 4, Dalat",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.9,
        reviewCount: 2156,
        category: "Café",
        isOpen: true,
        openHours: "7:00 AM - 10:00 PM",
        description: "A hidden gem where artisanal coffee culture meets French colonial architecture. The Married Café occupies a beautifully restored 1930s villa, complete with original mosaic floors and wrought-iron balconies. Each cup is crafted from locally-sourced beans roasted on-site, offering a true taste of Dalat's highland terroir.",
        designerTip: "Request a seat on the garden terrace overlooking the rose garden. Order the 'Dalat Mist'—their signature cold brew infused with local honey and a hint of lavender from their own garden.",
        coordinates: { lat: 11.9416, lng: 108.4378 }
    },
    4: {
        id: 4,
        title: "Valley of Love",
        location: "Phường 8, Dalat",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.5,
        reviewCount: 3421,
        category: "Nature",
        isOpen: true,
        openHours: "7:00 AM - 5:00 PM",
        description: "Originally known as 'Vallée d'Amour' during the French colonial era, this romantic landscape of rolling hills and flower gardens has been enchanting visitors for over a century. The valley's gentle slopes are adorned with seasonal wildflowers, creating ever-changing tapestries of color throughout the year.",
        designerTip: "Skip the main entrance crowds and take the lesser-known hiking trail from the eastern side. You'll pass through a pristine pine forest before emerging at a secluded viewpoint overlooking the entire valley.",
        coordinates: { lat: 11.9521, lng: 108.4289 }
    },
    5: {
        id: 5,
        title: "Datanla Waterfall",
        location: "Prenn Pass, Dalat",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.6,
        reviewCount: 1876,
        category: "Waterfall",
        isOpen: true,
        openHours: "7:00 AM - 5:00 PM",
        description: "Hidden within ancient forest along the famous Prenn Pass, Datanla Waterfall cascades through multiple tiers, creating natural pools perfect for a refreshing dip. The surrounding jungle teems with exotic flora and the rhythmic sound of falling water creates a natural symphony.",
        designerTip: "Take the alpine coaster down for a thrilling arrival, but hike back up on foot—the forest trail reveals hidden smaller cascades that most visitors miss. The best photography light is around 10 AM.",
        coordinates: { lat: 11.9089, lng: 108.4567 }
    },
    6: {
        id: 6,
        title: "Mai Anh Đào Street",
        location: "Phường 3, Dalat",
        image: "https://images.unsplash.com/photo-1462275646964-a0e3571f4f5c?w=1920&h=1080&fit=crop&crop=center",
        rating: 4.7,
        reviewCount: 654,
        category: "Street",
        isOpen: true,
        openHours: "Open 24 hours",
        description: "Every spring, Mai Anh Đào Street transforms into a dreamscape of delicate pink cherry blossoms. This picturesque lane, lined with French villas and artisan boutiques, offers an authentic glimpse into Dalat's romantic soul. The cherry trees were planted decades ago and have become an iconic symbol of the city.",
        designerTip: "Visit in late January to early February for peak bloom. The best time for photos is golden hour when the warm light illuminates the blossoms against the pastel-colored villas.",
        coordinates: { lat: 11.9398, lng: 108.4356 }
    }
};

// =============================================================================
// COMPONENT: DetailPage
// =============================================================================

const DetailPage = () => {
    const { id } = useParams();
    const [isSaved, setIsSaved] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get place data (fallback to place 1 if not found)
    const place = placeDetails[id] || placeDetails[1];

    // Render star rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    strokeWidth={1}
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star
                    key="half"
                    className="w-4 h-4 fill-amber-400/50 text-amber-400"
                    strokeWidth={1}
                />
            );
        }

        return stars;
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* ================================================================= */}
            {/* IMMERSIVE HERO SECTION */}
            {/* ================================================================= */}
            <section className="relative w-full h-[50vh] md:h-[60vh]">
                {/* Skeleton loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/20 animate-pulse" />
                )}

                {/* Hero Image */}
                <img
                    src={place.image}
                    alt={place.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-opacity duration-500
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Glassmorphism Back Button */}
                <Link
                    to="/"
                    className="
                        absolute top-5 left-5 z-10
                        p-3 rounded-full
                        bg-white/30 backdrop-blur-md
                        hover:bg-white/50 active:scale-95
                        transition-all duration-200
                        shadow-lg
                    "
                    aria-label="Go back to home"
                >
                    <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
                </Link>

                {/* Title & Meta - Inside Hero Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                    <div className="max-w-4xl">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-0.5">
                                {renderStars(place.rating)}
                            </div>
                            <span className="text-sm font-manrope text-white/90">
                                {place.rating} ({place.reviewCount.toLocaleString()} reviews)
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-tenor text-3xl md:text-4xl lg:text-5xl text-white leading-tight drop-shadow-lg">
                            {place.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* REFINED INFO & ACTION BAR */}
            {/* ================================================================= */}
            <section className="px-6 py-6 border-b border-gray-100">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    {/* Status & Category */}
                    <div className="flex items-center gap-4">
                        {/* Open Status */}
                        <div className="flex items-center gap-2">
                            <span className={`
                                w-2 h-2 rounded-full 
                                ${place.isOpen ? 'bg-blue-500' : 'bg-red-500'}
                            `} />
                            <span className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-600">
                                {place.isOpen ? 'Open Now' : 'Closed'}
                            </span>
                        </div>

                        {/* Divider */}
                        <span className="text-gray-300">|</span>

                        {/* Category */}
                        <span className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-600">
                            {place.category}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Call Button */}
                        <button
                            className="
                                p-3 rounded-full bg-white
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                                transition-all duration-200
                            "
                            aria-label="Call"
                        >
                            <Phone className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                        </button>

                        {/* Share Button */}
                        <button
                            className="
                                p-3 rounded-full bg-white
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                                transition-all duration-200
                            "
                            aria-label="Share"
                        >
                            <Share2 className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className={`
                                p-3 rounded-full
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                                transition-all duration-200
                                ${isSaved ? 'bg-primary' : 'bg-white'}
                            `}
                            aria-label={isSaved ? 'Remove from saved' : 'Save'}
                        >
                            <Bookmark
                                className={`w-5 h-5 transition-colors ${isSaved ? 'text-white fill-white' : 'text-gray-600'}`}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* CONTENT SECTIONS */}
            {/* ================================================================= */}
            <div className="px-6 md:px-8 lg:px-12 py-8 md:py-12 max-w-4xl mx-auto space-y-12">

                {/* Location & Hours Info */}
                <section className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-400 mb-1">
                                Location
                            </p>
                            <p className="font-manrope text-gray-700 leading-relaxed">
                                {place.location}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-400 mb-1">
                                Hours
                            </p>
                            <p className="font-manrope text-gray-700 leading-relaxed">
                                {place.openHours}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section>
                    <h2 className="font-tenor text-xl md:text-2xl text-gray-900 mb-4">
                        About
                    </h2>
                    <p className="font-manrope text-gray-700 leading-relaxed text-base md:text-lg">
                        {place.description}
                    </p>
                </section>

                {/* ============================================================= */}
                {/* DESIGNER'S TIP FEATURE BOX */}
                {/* ============================================================= */}
                <section className="bg-blue-700/10 rounded-2xl p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/20 flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="font-tenor text-lg text-gray-900 mb-2">
                                AI's Tip
                            </h3>
                            <p className="font-manrope font-medium text-gray-700 leading-relaxed">
                                {place.designerTip}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* MAP SECTION */}
                {/* ============================================================= */}
                <section>
                    <h2 className="font-tenor text-xl md:text-2xl text-gray-900 mb-4">
                        Location
                    </h2>
                    <div className="rounded-3xl overflow-hidden shadow-lg">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.123456789!2d${place.coordinates.lng}!3d${place.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU2JzMwLjAiTiAxMDjCsDI2JzE3LjAiRQ!5e1!3m2!1sen!2s!4v1703462400000!5m2!1sen!2s`}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${place.title}`}
                            className="w-full h-72 md:h-80"
                        />
                    </div>
                </section>
            </div>

            {/* ================================================================= */}
            {/* FIXED BOTTOM BUTTON */}
            {/* ================================================================= */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            w-full py-4 px-6 rounded-2xl
                            bg-[#2C3E50] hover:bg-[#34495E]
                            text-white font-manrope font-semibold text-base
                            flex items-center justify-center gap-2
                            transition-colors duration-200
                            active:scale-[0.98]
                        "
                        aria-label="Get directions"
                    >
                        <Navigation className="w-5 h-5" strokeWidth={1.5} />
                        Get Directions
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
