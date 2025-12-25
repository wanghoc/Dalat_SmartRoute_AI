/**
 * ============================================================
 * EXPRESS SERVER
 * Smart Da Lat Tourism Recommendation System
 * ============================================================
 * 
 * Main server entry point with API routes for:
 * - Weather data (OpenWeatherMap)
 * - Recommendations (filtered by weather + time)
 * - Chatbot queries
 * 
 * @author Smart Da Lat Tourism Team
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import {
    getRecommendations,
    parseWeatherCondition,
    loadLocations
} from './controllers/recommendationController.js';
import {
    processChatbotQuery,
    getQuickSuggestions
} from './controllers/chatbotController.js';

// ============================================================
// Configuration
// ============================================================

const app = express();
const PORT = process.env.PORT || 3001;

// OpenWeatherMap API Configuration
// NOTE: Replace with your own API key from https://openweathermap.org/api
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'e4b5202e7eabe536609be876b6bb82cb';
const DALAT_CITY = 'Da Lat,VN';

// ============================================================
// Middleware
// ============================================================

// Enable CORS for frontend communication
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================================
// API Routes
// ============================================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Smart Da Lat Tourism API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/weather
 * Fetch current weather for Da Lat from OpenWeatherMap
 * 
 * @returns {Object} Weather data including temp, condition, and standardized status
 */
app.get('/api/weather', async (req, res) => {
    try {
        // Check if API key is configured
        if (OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
            // Return mock data for demo purposes
            console.log('⚠️ Using mock weather data. Set OPENWEATHER_API_KEY for real data.');
            return res.json({
                success: true,
                data: {
                    city: 'Da Lat',
                    country: 'VN',
                    temperature: 18,
                    feels_like: 17,
                    humidity: 85,
                    description: 'Partly cloudy',
                    icon: '03d',
                    main: 'Clouds',
                    condition: 'cloudy', // Standardized condition
                    wind_speed: 3.5,
                    forecast: 'Thời tiết tốt cho việc tham quan. / Good weather for sightseeing.',
                    is_mock: true
                }
            });
        }

        // Fetch real weather data from OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(DALAT_CITY)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch weather data');
        }

        // Parse the weather condition to standardized format
        const condition = parseWeatherCondition(data.weather[0].main, data.weather[0].description);

        // Generate forecast message based on condition
        let forecast = '';
        switch (condition) {
            case 'rainy':
                forecast = '🌧️ Trời đang mưa! Nên tham quan các địa điểm trong nhà. / Rainy! Indoor activities recommended.';
                break;
            case 'sunny':
            case 'clear':
                forecast = '☀️ Trời đẹp! Thích hợp tham quan ngoài trời. / Beautiful day for outdoor activities!';
                break;
            case 'cloudy':
                forecast = '⛅ Trời nhiều mây, thích hợp đi dạo. / Cloudy, perfect for a walk around the city.';
                break;
            default:
                forecast = 'Thời tiết tốt cho việc tham quan. / Good weather for sightseeing.';
        }

        res.json({
            success: true,
            data: {
                city: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                main: data.weather[0].main,
                condition: condition, // Standardized condition for filtering
                wind_speed: data.wind.speed,
                forecast: forecast,
                is_mock: false
            }
        });

    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather data',
            message: error.message
        });
    }
});

/**
 * GET /api/recommendations
 * Get recommended places based on current weather and time
 * 
 * @query {string} condition - Weather condition (optional, will fetch if not provided)
 * @returns {Array} Filtered and sorted recommendations
 */
app.get('/api/recommendations', async (req, res) => {
    try {
        let weatherCondition = req.query.condition;

        // If no condition provided, try to fetch current weather
        if (!weatherCondition) {
            // Default to 'cloudy' if weather API is not configured
            weatherCondition = 'cloudy';
        }

        // Validate weather condition
        const validConditions = ['rainy', 'sunny', 'cloudy', 'clear'];
        if (!validConditions.includes(weatherCondition)) {
            weatherCondition = 'cloudy'; // Default fallback
        }

        // Get current time for filtering open places
        const currentTime = new Date();

        // Get filtered recommendations
        const recommendations = getRecommendations(weatherCondition, currentTime);

        res.json({
            success: true,
            data: {
                condition: weatherCondition,
                current_time: currentTime.toISOString(),
                count: recommendations.length,
                places: recommendations
            }
        });

    } catch (error) {
        console.error('Recommendations Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to get recommendations',
            message: error.message
        });
    }
});

/**
 * GET /api/places
 * Get all places without filtering (for search/browse)
 * 
 * @returns {Array} All places in the database
 */
app.get('/api/places', (req, res) => {
    try {
        const places = loadLocations();
        res.json({
            success: true,
            data: {
                count: places.length,
                places: places
            }
        });
    } catch (error) {
        console.error('Places Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to load places',
            message: error.message
        });
    }
});

/**
 * POST /api/chatbot
 * Process chatbot query and return relevant places
 * 
 * @body {string} query - User's natural language query
 * @returns {Object} Response with matching places or Google Search link
 */
app.post('/api/chatbot', (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query is required',
                message: 'Vui lòng nhập câu hỏi. / Please enter a question.'
            });
        }

        // Process the query
        const result = processChatbotQuery(query);

        res.json(result);

    } catch (error) {
        console.error('Chatbot Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to process query',
            message: error.message
        });
    }
});

/**
 * GET /api/chatbot/suggestions
 * Get quick suggestions for chatbot UI
 * 
 * @returns {Array} Array of example queries
 */
app.get('/api/chatbot/suggestions', (req, res) => {
    const suggestions = getQuickSuggestions();
    res.json({
        success: true,
        suggestions: suggestions
    });
});

// ============================================================
// Error Handling
// ============================================================

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
    });
});

// ============================================================
// Server Startup
// ============================================================

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   🌸 Smart Da Lat Tourism API Server                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║   🚀 Server running on: http://localhost:${PORT}              ║`);
    console.log('║   📍 Location: Da Lat, Vietnam                             ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║   API Endpoints:                                           ║');
    console.log('║   • GET  /api/health          - Health check               ║');
    console.log('║   • GET  /api/weather         - Current weather            ║');
    console.log('║   • GET  /api/recommendations - Filtered places            ║');
    console.log('║   • GET  /api/places          - All places                 ║');
    console.log('║   • POST /api/chatbot         - Chat query                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
});

export default app;
