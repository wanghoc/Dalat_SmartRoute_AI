/**
 * ============================================================
 * MAP EMBED COMPONENT
 * Smart Da Lat Tourism
 * ============================================================
 * 
 * Embeds Google Maps for Da Lat overview
 * 
 * @component MapEmbed
 */

/**
 * MapEmbed Component
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 */
const MapEmbed = ({ className = '' }) => {
    // Da Lat center coordinates
    const DALAT_LAT = 11.9404;
    const DALAT_LNG = 108.4583;

    // Google Maps embed URL for Da Lat
    // Note: For production, use Google Maps Embed API with your API key
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62586.29372089635!2d108.41!3d11.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112fef20988b1%3A0xad5f228b672bf930!2sDa%20Lat%2C%20Lam%20Dong%2C%20Vietnam!5e0!3m2!1sen!2s!4v1703500000000!5m2!1sen!2s`;

    return (
        <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
            {/* Map header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="glass px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                        📍 Bản đồ Đà Lạt
                    </span>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${DALAT_LAT},${DALAT_LNG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass px-4 py-2 rounded-full text-sm font-medium text-primary-600 
                     hover:bg-white transition-colors"
                >
                    Mở Google Maps →
                </a>
            </div>

            {/* Map iframe */}
            <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Da Lat Map"
                className="w-full h-full"
            />
        </div>
    );
};

export default MapEmbed;
