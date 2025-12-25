/**
 * ============================================================
 * RECOMMENDATION CONTROLLER
 * Smart Da Lat Tourism Recommendation System
 * ============================================================
 * 
 * Core filtering logic for recommending places based on:
 * 1. Weather conditions (rainy → indoor, sunny → outdoor)
 * 2. Opening hours (only show places currently OPEN)
 * 
 * @author Smart Da Lat Tourism Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load locations data from JSON file
 * @returns {Array} Array of location objects
 */
export const loadLocations = () => {
    const dataPath = path.join(__dirname, '..', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    return data.locations;
};

/**
 * Parse OpenWeatherMap weather condition to standardized format
 * Converts various weather conditions to: ['rainy', 'sunny', 'cloudy', 'clear']
 * 
 * @param {string} weatherMain - Main weather condition from OpenWeatherMap (e.g., 'Rain', 'Clouds')
 * @param {string} weatherDescription - Detailed description (e.g., 'light rain', 'scattered clouds')
 * @returns {string} Standardized weather condition
 */
export const parseWeatherCondition = (weatherMain, weatherDescription = '') => {
    // Convert to lowercase for easier matching
    const main = weatherMain?.toLowerCase() || '';
    const desc = weatherDescription?.toLowerCase() || '';

    // Rainy conditions
    if (main.includes('rain') || main.includes('drizzle') ||
        main.includes('thunderstorm') || desc.includes('rain')) {
        return 'rainy';
    }

    // Clear/Sunny conditions
    if (main === 'clear' || desc.includes('clear sky')) {
        return 'clear';
    }

    // Sunny (based on clear with specific icon or description)
    if (main === 'clear' && !desc.includes('night')) {
        return 'sunny';
    }

    // Cloudy conditions
    if (main === 'clouds' || main.includes('cloud') ||
        main === 'mist' || main === 'fog' || main === 'haze') {
        return 'cloudy';
    }

    // Default to cloudy for unknown conditions
    return 'cloudy';
};

/**
 * Check if a place is currently open based on opening hours
 * Handles edge cases like places open past midnight
 * 
 * @param {Object} openingHours - Object with 'start' and 'end' time strings (HH:MM format)
 * @param {Date} currentTime - Current date/time to check against
 * @returns {boolean} True if place is currently open
 */
export const isPlaceOpen = (openingHours, currentTime = new Date()) => {
    if (!openingHours || !openingHours.start || !openingHours.end) {
        return true; // If no hours specified, assume always open
    }

    // Parse opening hours
    const [startHour, startMin] = openingHours.start.split(':').map(Number);
    const [endHour, endMin] = openingHours.end.split(':').map(Number);

    // Get current hours and minutes
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Convert to minutes since midnight for easier comparison
    const currentTotalMinutes = currentHour * 60 + currentMinutes;
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    // Handle special case: 00:00 to 23:59 means 24 hours
    if (startTotalMinutes === 0 && endTotalMinutes === 1439) {
        return true;
    }

    // Handle places that close past midnight (e.g., 18:00 - 02:00)
    if (endTotalMinutes < startTotalMinutes) {
        return currentTotalMinutes >= startTotalMinutes || currentTotalMinutes <= endTotalMinutes;
    }

    // Normal case: check if current time is within range
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
};

/**
 * Filter places by weather condition
 * 
 * RULE 1: If Weather = Rain → Filter for indoor, cafe, museum, restaurant
 * RULE 2: If Weather = Sunny/Cloudy/Clear → Prioritize outdoor, waterfall, viewpoint
 * 
 * @param {Array} places - Array of place objects
 * @param {string} weatherCondition - Standardized weather condition
 * @returns {Array} Filtered and sorted places
 */
export const filterByWeather = (places, weatherCondition) => {
    // Types suitable for rainy weather (indoor activities)
    const rainyTypes = ['indoor', 'cafe', 'museum', 'restaurant'];

    // Types suitable for sunny/clear weather (outdoor activities)
    const sunnyTypes = ['outdoor', 'waterfall', 'viewpoint'];

    if (weatherCondition === 'rainy') {
        // During rain: prioritize indoor places
        // First, filter places that are good for rainy weather
        const filtered = places.filter(place => {
            // Check if place type is suitable for rain
            const isSuitableType = rainyTypes.includes(place.type);
            // Also check if the place's best_weather includes rainy
            const isGoodForWeather = place.best_weather.includes('rainy');
            return isSuitableType || isGoodForWeather;
        });

        // Sort by: places specifically good for rainy weather first
        return filtered.sort((a, b) => {
            const aScore = a.best_weather.includes('rainy') ? 1 : 0;
            const bScore = b.best_weather.includes('rainy') ? 1 : 0;
            return bScore - aScore;
        });
    }

    // For sunny, clear, or cloudy weather: prioritize outdoor activities
    const filtered = places.filter(place => {
        // Check if place's best_weather includes current condition
        const isGoodForWeather = place.best_weather.includes(weatherCondition);
        // Prioritize outdoor types for good weather
        const isSuitableType = sunnyTypes.includes(place.type);
        return isGoodForWeather || isSuitableType;
    });

    // Sort by: outdoor activities first, then by best_weather match
    return filtered.sort((a, b) => {
        // Score based on type suitability
        const aTypeScore = sunnyTypes.includes(a.type) ? 2 : 0;
        const bTypeScore = sunnyTypes.includes(b.type) ? 2 : 0;

        // Score based on weather match
        const aWeatherScore = a.best_weather.includes(weatherCondition) ? 1 : 0;
        const bWeatherScore = b.best_weather.includes(weatherCondition) ? 1 : 0;

        return (bTypeScore + bWeatherScore) - (aTypeScore + aWeatherScore);
    });
};

/**
 * Get recommended places based on weather and time
 * Main function that combines all filtering logic
 * 
 * @param {string} weatherCondition - Standardized weather condition
 * @param {Date} currentTime - Current date/time for opening hours check
 * @returns {Array} Filtered and sorted recommendations
 */
export const getRecommendations = (weatherCondition, currentTime = new Date()) => {
    // Load all locations
    const allPlaces = loadLocations();

    // Step 1: Filter by opening hours (only show places currently OPEN)
    const openPlaces = allPlaces.filter(place => isPlaceOpen(place.opening_hours, currentTime));

    // Step 2: Filter and sort by weather condition
    const recommendations = filterByWeather(openPlaces, weatherCondition);

    // Add additional info to each recommendation
    return recommendations.map(place => ({
        ...place,
        isOpen: true, // Already filtered for open places
        currentWeather: weatherCondition,
        directions_url: `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
    }));
};

/**
 * Search places by keyword
 * Used by chatbot for natural language queries
 * 
 * @param {string} keyword - Search keyword
 * @returns {Array} Matching places
 */
export const searchByKeyword = (keyword) => {
    const allPlaces = loadLocations();
    const searchTerm = keyword.toLowerCase();

    return allPlaces.filter(place => {
        const nameMatch = place.name.toLowerCase().includes(searchTerm);
        const descMatch = place.description.toLowerCase().includes(searchTerm);
        const typeMatch = place.type.toLowerCase().includes(searchTerm);
        return nameMatch || descMatch || typeMatch;
    });
};

// Export default object with all functions
export default {
    parseWeatherCondition,
    isPlaceOpen,
    filterByWeather,
    getRecommendations,
    searchByKeyword,
    loadLocations
};
