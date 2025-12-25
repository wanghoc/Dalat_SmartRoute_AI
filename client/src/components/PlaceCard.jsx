/**
 * PlaceCard Component
 * Da Lat SmartRoute
 * 
 * Clean, minimal card design with less icons
 */

import { Link } from 'react-router-dom';

/**
 * Get badge color based on place type
 */
const getTypeBadge = (type) => {
    const types = {
        indoor: { label: 'Trong nhà', color: 'bg-blue-100 text-blue-700' },
        outdoor: { label: 'Ngoài trời', color: 'bg-green-100 text-green-700' },
        cafe: { label: 'Cafe', color: 'bg-amber-100 text-amber-700' },
        waterfall: { label: 'Thác nước', color: 'bg-cyan-100 text-cyan-700' },
        viewpoint: { label: 'Ngắm cảnh', color: 'bg-purple-100 text-purple-700' },
        restaurant: { label: 'Nhà hàng', color: 'bg-rose-100 text-rose-700' },
        garden: { label: 'Vườn hoa', color: 'bg-pink-100 text-pink-700' },
        adventure: { label: 'Phiêu lưu', color: 'bg-orange-100 text-orange-700' }
    };
    return types[type] || { label: type, color: 'bg-slate-100 text-slate-700' };
};

const PlaceCard = ({ place }) => {
    const {
        id,
        name,
        type,
        description,
        opening_hours,
        image,
        price_range
    } = place;

    const typeBadge = getTypeBadge(type);

    const formatHours = () => {
        if (!opening_hours) return '';
        if (opening_hours.start === '00:00' && opening_hours.end === '23:59') {
            return '24/7';
        }
        return `${opening_hours.start} - ${opening_hours.end}`;
    };

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400';
    };

    return (
        <Link to={`/place/${id}`} className="card group block">
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={handleImageError}
                    loading="lazy"
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`badge ${typeBadge.color}`}>
                        {typeBadge.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {name}
                </h3>

                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatHours()}</span>
                    {price_range && <span>{price_range}</span>}
                </div>
            </div>
        </Link>
    );
};

export default PlaceCard;
