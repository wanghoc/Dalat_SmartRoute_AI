/**
 * ============================================================
 * CHATBOT CONTROLLER
 * Smart Da Lat Tourism Recommendation System
 * ============================================================
 * 
 * Handles natural language queries from users
 * Uses keyword matching to find relevant places
 * 
 * @author Smart Da Lat Tourism Team
 * @version 1.0.0
 */

import { loadLocations, isPlaceOpen } from './recommendationController.js';

/**
 * Keyword mappings for different types of queries
 * Maps user keywords to place types or attributes
 */
const KEYWORD_MAPPINGS = {
    // Place types
    coffee: ['cafe'],
    cafe: ['cafe'],
    'cà phê': ['cafe'],
    caphe: ['cafe'],
    restaurant: ['restaurant'],
    'nhà hàng': ['restaurant'],
    food: ['restaurant', 'cafe'],
    'ăn': ['restaurant', 'cafe'],
    waterfall: ['waterfall'],
    'thác': ['waterfall'],
    thac: ['waterfall'],
    museum: ['indoor'],
    'bảo tàng': ['indoor'],
    view: ['viewpoint'],
    'ngắm cảnh': ['viewpoint'],
    sunset: ['viewpoint', 'cafe'],
    'hoàng hôn': ['viewpoint', 'cafe'],
    market: ['outdoor'],
    'chợ': ['outdoor'],
    cho: ['outdoor'],
    night: ['outdoor', 'cafe', 'restaurant'],
    'đêm': ['outdoor', 'cafe', 'restaurant'],
    outdoor: ['outdoor', 'viewpoint', 'waterfall'],
    indoor: ['indoor', 'cafe', 'museum', 'restaurant'],
    rain: ['indoor', 'cafe', 'museum', 'restaurant'],
    'mưa': ['indoor', 'cafe', 'museum', 'restaurant'],

    // Activities
    hiking: ['viewpoint', 'waterfall'],
    'leo núi': ['viewpoint'],
    photo: ['viewpoint', 'cafe', 'waterfall'],
    'chụp ảnh': ['viewpoint', 'cafe', 'waterfall'],
    romantic: ['cafe', 'restaurant', 'viewpoint'],
    'lãng mạn': ['cafe', 'restaurant', 'viewpoint'],
    adventure: ['waterfall', 'viewpoint', 'outdoor'],
    'phiêu lưu': ['waterfall', 'viewpoint', 'outdoor'],
};

/**
 * Extract time from user query
 * Supports various time formats: "10 PM", "22:00", "10pm", etc.
 * 
 * @param {string} query - User's query string
 * @returns {Date|null} Parsed time or null if no time found
 */
const extractTimeFromQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    // Pattern 1: "10 PM", "10PM", "10 pm"
    const pmPattern = /(\d{1,2})\s*pm/i;
    const amPattern = /(\d{1,2})\s*am/i;

    // Pattern 2: "22:00", "22h", "22 giờ"
    const hourPattern = /(\d{1,2}):?(\d{2})?\s*(h|giờ|gio)?/i;

    let hours = null;
    let minutes = 0;

    // Check PM pattern
    const pmMatch = lowerQuery.match(pmPattern);
    if (pmMatch) {
        hours = parseInt(pmMatch[1]);
        if (hours !== 12) hours += 12;
    }

    // Check AM pattern
    const amMatch = lowerQuery.match(amPattern);
    if (amMatch) {
        hours = parseInt(amMatch[1]);
        if (hours === 12) hours = 0;
    }

    // Check hour pattern (24-hour format)
    if (hours === null) {
        const hourMatch = lowerQuery.match(hourPattern);
        if (hourMatch) {
            hours = parseInt(hourMatch[1]);
            if (hourMatch[2]) {
                minutes = parseInt(hourMatch[2]);
            }
        }
    }

    // If we found a valid time, create a Date object
    if (hours !== null && hours >= 0 && hours < 24) {
        const now = new Date();
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    return null;
};

/**
 * Extract keywords from user query
 * Matches against predefined keyword mappings
 * 
 * @param {string} query - User's query string
 * @returns {Array} Array of matched place types
 */
const extractKeywords = (query) => {
    const lowerQuery = query.toLowerCase();
    const matchedTypes = new Set();

    // Check each keyword mapping
    for (const [keyword, types] of Object.entries(KEYWORD_MAPPINGS)) {
        if (lowerQuery.includes(keyword)) {
            types.forEach(type => matchedTypes.add(type));
        }
    }

    return Array.from(matchedTypes);
};

/**
 * Process chatbot query and return relevant places
 * 
 * @param {string} query - User's natural language query
 * @returns {Object} Response object with places and message
 */
export const processChatbotQuery = (query) => {
    if (!query || query.trim().length === 0) {
        return {
            success: false,
            message: 'Xin hãy nhập câu hỏi của bạn. / Please enter your question.',
            places: [],
            google_search_link: null
        };
    }

    const allPlaces = loadLocations();
    let filteredPlaces = [];
    let responseMessage = '';

    // Extract time from query (if any)
    const queryTime = extractTimeFromQuery(query);

    // Extract keywords/types from query
    const matchedTypes = extractKeywords(query);

    // Filter places by matched types
    if (matchedTypes.length > 0) {
        filteredPlaces = allPlaces.filter(place =>
            matchedTypes.includes(place.type)
        );
        responseMessage = `Tìm thấy ${filteredPlaces.length} địa điểm phù hợp với yêu cầu của bạn.`;
    } else {
        // Try direct search in place names and descriptions
        const searchTerm = query.toLowerCase();
        filteredPlaces = allPlaces.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.name_vi?.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm)
        );

        if (filteredPlaces.length > 0) {
            responseMessage = `Tìm thấy ${filteredPlaces.length} địa điểm liên quan.`;
        }
    }

    // Filter by opening hours if time was specified
    if (queryTime && filteredPlaces.length > 0) {
        const openPlaces = filteredPlaces.filter(place =>
            isPlaceOpen(place.opening_hours, queryTime)
        );

        if (openPlaces.length > 0) {
            filteredPlaces = openPlaces;
            responseMessage = `Tìm thấy ${filteredPlaces.length} địa điểm mở cửa lúc ${queryTime.getHours()}:${String(queryTime.getMinutes()).padStart(2, '0')}.`;
        } else {
            responseMessage = `Không có địa điểm nào mở cửa lúc ${queryTime.getHours()}:${String(queryTime.getMinutes()).padStart(2, '0')}.`;
        }
    }

    // If no results found, provide Google Search fallback
    if (filteredPlaces.length === 0) {
        const googleSearchQuery = encodeURIComponent(`${query} Đà Lạt Du Lịch`);
        return {
            success: false,
            message: `Xin lỗi, không tìm thấy kết quả phù hợp trong cơ sở dữ liệu. Bạn có thể thử tìm kiếm trên Google:`,
            places: [],
            google_search_link: `https://www.google.com/search?q=${googleSearchQuery}`
        };
    }

    // Add directions URL to each place
    const placesWithDirections = filteredPlaces.map(place => ({
        ...place,
        directions_url: `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
    }));

    return {
        success: true,
        message: responseMessage,
        places: placesWithDirections.slice(0, 5), // Limit to 5 results for chatbot
        google_search_link: null
    };
};

/**
 * Get quick suggestions for common queries
 * Used for chatbot UI to show example queries
 * 
 * @returns {Array} Array of suggestion strings
 */
export const getQuickSuggestions = () => {
    return [
        'Quán cà phê view đẹp?',
        'Đi đâu lúc 10 PM?',
        'Coffee shops for sunset?',
        'Places open at night?',
        'Waterfall to visit today?',
        'Where to go when it rains?'
    ];
};

// Export default object
export default {
    processChatbotQuery,
    getQuickSuggestions,
    extractTimeFromQuery,
    extractKeywords
};
