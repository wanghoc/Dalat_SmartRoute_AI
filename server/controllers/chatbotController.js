/**
 * ============================================================
 * ENHANCED CHATBOT CONTROLLER
 * Da Lat SmartRoute
 * ============================================================
 * 
 * Advanced chatbot with:
 * - Context awareness
 * - Multi-turn conversations
 * - Weather-based fashion advice
 * - Activity planning
 * - Budget recommendations
 * 
 * @author Da Lat SmartRoute Team
 * @version 2.0.0
 */

import { loadLocations, isPlaceOpen } from './recommendationController.js';

/**
 * Comprehensive keyword mappings with Vietnamese support
 */
const KEYWORD_MAPPINGS = {
    // Place types
    coffee: ['cafe'],
    cafe: ['cafe'],
    'cà phê': ['cafe'],
    'ca phe': ['cafe'],
    caphe: ['cafe'],
    restaurant: ['restaurant'],
    'nhà hàng': ['restaurant'],
    'nha hang': ['restaurant'],
    food: ['restaurant', 'cafe'],
    'ăn': ['restaurant', 'cafe'],
    'an': ['restaurant', 'cafe'],
    waterfall: ['waterfall'],
    'thác': ['waterfall'],
    'thac': ['waterfall'],
    museum: ['indoor'],
    'bảo tàng': ['indoor'],
    'bao tang': ['indoor'],
    view: ['viewpoint'],
    'ngắm cảnh': ['viewpoint'],
    'ngam canh': ['viewpoint'],
    viewpoint: ['viewpoint'],
    market: ['outdoor'],
    'chợ': ['outdoor'],
    'cho': ['outdoor'],
    night: ['outdoor', 'cafe', 'restaurant'],
    'đêm': ['outdoor', 'cafe', 'restaurant'],
    'dem': ['outdoor', 'cafe', 'restaurant'],
    outdoor: ['outdoor', 'viewpoint', 'waterfall'],
    indoor: ['indoor', 'cafe', 'museum', 'restaurant'],
    rain: ['indoor', 'cafe', 'museum', 'restaurant'],
    'mưa': ['indoor', 'cafe', 'museum', 'restaurant'],
    'mua': ['indoor', 'cafe', 'museum', 'restaurant'],
    garden: ['garden'],
    'vườn': ['garden'],
    'vuon': ['garden'],
    adventure: ['adventure'],
    'phiêu lưu': ['adventure'],
    'phieu luu': ['adventure'],

    // Activities
    hiking: ['viewpoint', 'waterfall'],
    'leo núi': ['viewpoint'],
    'leo nui': ['viewpoint'],
    photo: ['viewpoint', 'cafe', 'waterfall', 'garden'],
    'chụp ảnh': ['viewpoint', 'cafe', 'waterfall', 'garden'],
    'chup anh': ['viewpoint', 'cafe', 'waterfall', 'garden'],
    romantic: ['cafe', 'restaurant', 'viewpoint'],
    'lãng mạn': ['cafe', 'restaurant', 'viewpoint'],
    'lang man': ['cafe', 'restaurant', 'viewpoint'],
    date: ['cafe', 'restaurant', 'viewpoint'],
    'hẹn hò': ['cafe', 'restaurant', 'viewpoint'],
    'hen ho': ['cafe', 'restaurant', 'viewpoint'],
    family: ['garden', 'adventure', 'outdoor'],
    'gia đình': ['garden', 'adventure', 'outdoor'],
    'gia dinh': ['garden', 'adventure', 'outdoor'],
    couple: ['cafe', 'restaurant', 'viewpoint'],
    'cặp đôi': ['cafe', 'restaurant', 'viewpoint'],
    'cap doi': ['cafe', 'restaurant', 'viewpoint'],
};

/**
 * Advanced fashion advice based on weather and temperature
 * @param {string} weather - Weather condition
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Detailed fashion advice
 */
const getFashionAdvice = (weather, temp = 18) => {
    const tempAdvice = temp < 15
        ? 'Thời tiết khá lạnh, nên mặc áo len dày, áo khoác ấm.'
        : temp < 20
            ? 'Thời tiết mát mẻ, áo khoác nhẹ hoặc hoodie sẽ phù hợp.'
            : temp < 25
                ? 'Thời tiết dễ chịu, áo thun dài tay hoặc áo sơ mi nhẹ.'
                : 'Thời tiết ấm áp, nên mặc đồ thoáng mát.';

    const weatherAdvice = {
        rainy: `🌧️ **Trời đang mưa:**
• ${tempAdvice}
• Áo khoác chống nước hoặc áo mưa bắt buộc
• Giày không thấm nước hoặc dép quai hậu
• Mang theo ô dự phòng
• Nếu đi xe máy, chuẩn bị áo mưa toàn thân
• Túi đựng đồ nên có lớp chống nước`,

        cloudy: `⛅ **Trời nhiều mây:**
• ${tempAdvice}
• Áo khoác nhẹ hoặc cardigan
• Mang theo áo mưa phòng khi (có thể có mưa rào)
• Giày thể thao hoặc giày sneaker thoải mái
• Phụ kiện: mũ, kính râm (khi nắng ló ra)`,

        sunny: `☀️ **Trời nắng đẹp:**
• Mặc đồ nhẹ, thoáng mát (áo thun, quần short)
• Kem chống nắng SPF 50+ (bắt buộc!)
• Mũ rộng vành hoặc nón lưỡi trai
• Kính râm chống UV
• Giày thể thao thoáng khí
• Mang theo nước uống đủ
• Áo khoác mỏng (vì Đà Lạt có thể se lạnh buổi chiều muộn)`,

        clear: `🌤️ **Trời trong xanh:**
• ${tempAdvice}
• Trang phục năng động, thoải mái
• Giày thể thao hoặc giày hiking (nếu đi trekking)
• Kem chống nắng
• Kính râm và mũ
• Áo khoác nhẹ cho buổi tối`
    };

    return weatherAdvice[weather] || weatherAdvice.cloudy;
};

/**
 * Get activity recommendations based on weather
 * @param {string} weather - Weather condition
 * @returns {string} Activity recommendations
 */
const getActivityRecommendations = (weather) => {
    const activities = {
        rainy: `🌧️ **Hoạt động phù hợp khi trời mưa:**

**Trong nhà:**
• Tham quan bảo tàng, gallery nghệ thuật
• Thăm Crazy House (kiến trúc độc đáo)
• Shopping tại các shop thời trang local
• Thử các món ăn đặc sản (bánh tráng nướng, lẩu...)

**Cafe view đẹp:**
• Mê Linh Coffee Garden (view thung lũng)
• An Cafe (mở 24/7, ấm cúng)
• Horizon Coffee (view 360 độ)

**Tip:** Mưa ở Đà Lạt rất lãng mạn, thích hợp đi cafe chill!`,

        cloudy: `⛅ **Hoạt động khi trời mát mẻ:**

**Dạo phố & khám phá:**
• Đi bộ quanh hồ Xuân Hương
• Khám phá chợ Đêm Đà Lạt (nếu chiều tối)
• Tham quan Ga Đà Lạt (kiến trúc cổ)
• Check-in tại Nhà Thờ Con Gà

**Thiên nhiên:**
• Vườn Hoa Thành Phố
• Đồi Chè Cầu Đất (nếu không mưa)
• Cafe sân vườn (Windmills, Mê Linh)

**Lưu ý:** Mang theo áo mưa phòng khi!`,

        sunny: `☀️ **Hoạt động khi trời nắng đẹp:**

**Thiên nhiên & phiêu lưu:**
• Chinh phục đỉnh Langbiang (trekking hoặc jeep)
• Thác Datanla, Thác Voi (đẹp nhất khi nắng)
• Hồ Tuyền Lâm (chèo kayak, đạp xe)
• ZooDoo Dalat (tương tác với động vật)

**Check-in đẹp:**
• Đồi Chè Cầu Đất (sáng sớm đẹp nhất)
• Cầu Đất Farm (tour chè & cafe)
• Valley of Love / Đồi Mộng Mơ

**Lưu ý:** Bôi kem chống nắng và mang đủ nước!`,

        clear: `🌤️ **Hoạt động khi trời trong lành:**

**Trải nghiệm đặc biệt:**
• Ngắm hoàng hôn tại Langbiang Peak
• Picnic tại Hồ Tuyền Lâm
• Tour kiến trúc Pháp cổ
• Chụp ảnh tại các viewpoint đẹp

**Ẩm thực:**
• Thử đặc sản địa phương
• Cafe có view (best time!)
• Chợ đêm (từ 18h)

**Perfect time:** Chiều đẹp nhất để tham quan outdoor!`
    };

    return activities[weather] || activities.cloudy;
};

/**
 * Budget-based recommendations
 * @param {string} budget - Budget level (cheap, medium, expensive)
 * @returns {Object} Filtered recommendations
 */
const getBudgetRecommendations = (budget) => {
    const allPlaces = loadLocations();

    const budgetRanges = {
        cheap: (price) => {
            if (!price || price === 'Miễn phí') return true;
            const match = price.match(/(\d+)/);
            return match && parseInt(match[1]) < 50000;
        },
        medium: (price) => {
            if (!price) return false;
            const match = price.match(/(\d+)/);
            return match && parseInt(match[1]) >= 50000 && parseInt(match[1]) <= 150000;
        },
        expensive: (price) => {
            const match = price.match(/(\d+)/);
            return match && parseInt(match[1]) > 150000;
        }
    };

    const filterFn = budgetRanges[budget] || budgetRanges.medium;
    const filtered = allPlaces.filter(p => filterFn(p.price_range));

    return {
        success: true,
        message: `Gợi ý ${filtered.length} địa điểm phù hợp với ngân sách ${budget === 'cheap' ? 'tiết kiệm' : budget === 'expensive' ? 'cao cấp' : 'trung bình'}:`,
        places: filtered.slice(0, 5)
    };
};

/**
 * Extract time from query
 * @param {string} query - User query
 * @returns {Date|null} Parsed time
 */
const extractTimeFromQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    // Patterns for time
    const pmPattern = /(\d{1,2})\s*(pm|chiều|tối|đêm)/i;
    const amPattern = /(\d{1,2})\s*(am|sáng|buổi sáng)/i;
    const hourPattern = /(\d{1,2}):?(\d{2})?\s*(h|giờ|gio)?/i;

    let hours = null;
    let minutes = 0;

    // Check PM
    const pmMatch = lowerQuery.match(pmPattern);
    if (pmMatch) {
        hours = parseInt(pmMatch[1]);
        if (hours !== 12) hours += 12;
    }

    // Check AM
    const amMatch = lowerQuery.match(amPattern);
    if (amMatch) {
        hours = parseInt(amMatch[1]);
        if (hours === 12) hours = 0;
    }

    // Check 24-hour format
    if (hours === null) {
        const hourMatch = lowerQuery.match(hourPattern);
        if (hourMatch) {
            hours = parseInt(hourMatch[1]);
            if (hourMatch[2]) minutes = parseInt(hourMatch[2]);
        }
    }

    if (hours !== null && hours >= 0 && hours < 24) {
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    return null;
};

/**
 * Extract keywords from query
 * @param {string} query - User query
 * @returns {Array} Matched place types
 */
const extractKeywords = (query) => {
    const lowerQuery = query.toLowerCase();
    const matchedTypes = new Set();

    for (const [keyword, types] of Object.entries(KEYWORD_MAPPINGS)) {
        if (lowerQuery.includes(keyword)) {
            types.forEach(type => matchedTypes.add(type));
        }
    }

    return Array.from(matchedTypes);
};

/**
 * Main chatbot processor with enhanced intelligence
 * @param {string} query - User query
 * @param {Object} context - Optional context (weather, previous queries)
 * @returns {Object} Response
 */
export const processChatbotQuery = (query, context = {}) => {
    if (!query || query.trim().length === 0) {
        return {
            success: false,
            message: 'Xin hãy nhập câu hỏi của bạn.',
            places: [],
            suggestions: [
                'Mặc gì hôm nay?',
                'Cafe view đẹp',
                'Làm gì khi mưa?',
                'Địa điểm rẻ nhất'
            ]
        };
    }

    const lowerQuery = query.toLowerCase();
    const allPlaces = loadLocations();

    // 1. Fashion/Outfit queries
    if (lowerQuery.includes('mặc') || lowerQuery.includes('mac') ||
        lowerQuery.includes('trang phục') || lowerQuery.includes('trang phuc') ||
        lowerQuery.includes('quần áo') || lowerQuery.includes('quan ao') ||
        lowerQuery.includes('outfit') || lowerQuery.includes('wear')) {
        return {
            success: true,
            message: getFashionAdvice(context.weather || 'cloudy', context.temperature || 18),
            places: [],
            type: 'fashion'
        };
    }

    // 2. Activity/What to do queries
    if (lowerQuery.includes('làm gì') || lowerQuery.includes('lam gi') ||
        lowerQuery.includes('hoạt động') || lowerQuery.includes('hoat dong') ||
        lowerQuery.includes('đi đâu') || lowerQuery.includes('di dau') ||
        lowerQuery.includes('nên đi') || lowerQuery.includes('nen di') ||
        lowerQuery.includes('what to do') || lowerQuery.includes('where to go')) {
        return {
            success: true,
            message: getActivityRecommendations(context.weather || 'cloudy'),
            places: [],
            type: 'activity'
        };
    }

    // 3. Budget queries
    if (lowerQuery.includes('rẻ') || lowerQuery.includes('re') ||
        lowerQuery.includes('tiết kiệm') || lowerQuery.includes('tiet kiem') ||
        lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
        return getBudgetRecommendations('cheap');
    }

    if (lowerQuery.includes('đắt') || lowerQuery.includes('dat') ||
        lowerQuery.includes('cao cấp') || lowerQuery.includes('cao cap') ||
        lowerQuery.includes('sang') || lowerQuery.includes('expensive') ||
        lowerQuery.includes('luxury')) {
        return getBudgetRecommendations('expensive');
    }

    // 4. Time-based queries
    const queryTime = extractTimeFromQuery(query);
    const matchedTypes = extractKeywords(query);

    // Filter by types
    let filteredPlaces = matchedTypes.length > 0
        ? allPlaces.filter(place => matchedTypes.includes(place.type))
        : allPlaces;

    // Filter by time if specified
    if (queryTime) {
        const openPlaces = filteredPlaces.filter(place =>
            isPlaceOpen(place.opening_hours, queryTime)
        );

        if (openPlaces.length > 0) {
            filteredPlaces = openPlaces;
            const timeStr = `${queryTime.getHours()}:${String(queryTime.getMinutes()).padStart(2, '0')}`;
            return {
                success: true,
                message: `Tìm thấy ${filteredPlaces.length} địa điểm mở cửa lúc ${timeStr}:`,
                places: filteredPlaces.slice(0, 5).map(p => ({
                    ...p,
                    directions_url: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
                }))
            };
        }
    }

    // 5. Direct search by name
    if (filteredPlaces.length === 0) {
        const searchTerm = query.toLowerCase();
        filteredPlaces = allPlaces.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.name_vi?.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            place.description_vi?.toLowerCase().includes(searchTerm)
        );
    }

    // 6. Return results or Google search fallback
    if (filteredPlaces.length > 0) {
        return {
            success: true,
            message: `Tìm thấy ${filteredPlaces.length} địa điểm phù hợp:`,
            places: filteredPlaces.slice(0, 5).map(p => ({
                ...p,
                directions_url: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
            }))
        };
    }

    // Fallback to Google Search
    const googleSearchQuery = encodeURIComponent(`${query} Đà Lạt Du Lịch`);
    return {
        success: false,
        message: `Không tìm thấy kết quả phù hợp. Bạn có thể thử:`,
        places: [],
        google_search_link: `https://www.google.com/search?q=${googleSearchQuery}`,
        suggestions: [
            'Cafe view đẹp',
            'Thác nước gần đây',
            'Quán ăn ngon',
            'Địa điểm check-in'
        ]
    };
};

/**
 * Get quick suggestions
 * @returns {Array} Suggestion strings
 */
export const getQuickSuggestions = () => {
    return [
        'Mặc gì hôm nay?',
        'Quán cafe view đẹp?',
        'Làm gì khi trời mưa?',
        'Địa điểm mở cửa tối nay?',
        'Thác nước nào đẹp nhất?',
        'Địa điểm rẻ nhất?',
        'Đi đâu với gia đình?',
        'Chỗ chụp ảnh đẹp?'
    ];
};

export default {
    processChatbotQuery,
    getQuickSuggestions,
    getFashionAdvice,
    getActivityRecommendations
};
