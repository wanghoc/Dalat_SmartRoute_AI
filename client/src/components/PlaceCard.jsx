/**
 * ============================================================
 * PLACE CARD COMPONENT
 * Smart Da Lat Tourism
 * ============================================================
 * 
 * Displays a single place recommendation with:
 * - Image, name, type badge
 * - Description, opening hours
 * - Get Directions button
 * 
 * @component PlaceCard
 */

/**
 * Get badge style based on place type
 * @param {string} type - Place type
 * @returns {string} Tailwind classes for badge
 */
const getTypeBadge = (type) => {
    const badges = {
        indoor: { label: '🏠 Trong nhà', class: 'badge-indoor' },
        outdoor: { label: '🌳 Ngoài trời', class: 'badge-outdoor' },
        cafe: { label: '☕ Cafe', class: 'badge-cafe' },
        waterfall: { label: '💧 Thác nước', class: 'badge-waterfall' },
        viewpoint: { label: '🏔️ Ngắm cảnh', class: 'badge-viewpoint' },
        restaurant: { label: '🍽️ Nhà hàng', class: 'badge-restaurant' },
        museum: { label: '🏛️ Bảo tàng', class: 'badge-indoor' }
    };
    return badges[type] || { label: type, class: 'badge-indoor' };
};

/**
 * PlaceCard Component
 * 
 * @param {Object} props
 * @param {Object} props.place - Place data object
 * @param {boolean} props.featured - Whether this is a featured card (larger)
 */
const PlaceCard = ({ place, featured = false }) => {
    const {
        name,
        name_vi,
        type,
        description,
        opening_hours,
        image,
        address,
        price_range,
        directions_url,
        lat,
        lng
    } = place;

    // Get badge info for place type
    const typeBadge = getTypeBadge(type);

    // Format opening hours
    const formatHours = () => {
        if (!opening_hours) return 'Liên hệ để biết giờ mở cửa';

        // Special case for 24-hour places
        if (opening_hours.start === '00:00' && opening_hours.end === '23:59') {
            return '🕐 Mở 24/7';
        }

        return `🕐 ${opening_hours.start} - ${opening_hours.end}`;
    };

    // Generate Google Maps directions URL
    const getDirectionsUrl = () => {
        return directions_url || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    };

    // Handle image loading error
    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400';
    };

    return (
        <div
            className={`card group ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
        >
            {/* Image container */}
            <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-80' : 'h-48'}`}>
                <img
                    src={image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={handleImageError}
                    loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Type badge */}
                <div className="absolute top-4 left-4">
                    <span className={`badge ${typeBadge.class} shadow-md`}>
                        {typeBadge.label}
                    </span>
                </div>

                {/* Open status */}
                <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Đang mở
                    </span>
                </div>

                {/* Name overlay on image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold drop-shadow-lg line-clamp-2">
                        {name}
                    </h3>
                    {name_vi && name_vi !== name && (
                        <p className="text-white/80 text-sm drop-shadow-md">{name_vi}</p>
                    )}
                </div>
            </div>

            {/* Content section */}
            <div className="p-5">
                {/* Opening hours and price */}
                <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-gray-600">{formatHours()}</span>
                    {price_range && (
                        <span className="text-secondary-600 font-medium">💰 {price_range}</span>
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Address */}
                {address && (
                    <p className="text-gray-500 text-xs mb-4 flex items-start gap-1">
                        <span>📍</span>
                        <span className="line-clamp-1">{address}</span>
                    </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                    {/* Get Directions button */}
                    <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-center text-sm py-2"
                    >
                        🗺️ Chỉ đường
                    </a>

                    {/* View on Google Maps */}
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl 
                       transition-colors duration-300 text-sm"
                    >
                        📍 Map
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;
