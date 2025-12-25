/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Custom color palette for Da Lat Tourism theme
            colors: {
                // Primary: Light Blue (Sky theme)
                primary: {
                    50: '#E0F7FA',
                    100: '#B2EBF2',
                    200: '#80DEEA',
                    300: '#4DD0E1',
                    400: '#26C6DA',
                    500: '#00BCD4',
                    600: '#00ACC1',
                    700: '#0097A7',
                    800: '#00838F',
                    900: '#006064',
                },
                // Secondary: Green (Nature theme)
                secondary: {
                    50: '#E8F5E9',
                    100: '#C8E6C9',
                    200: '#A5D6A7',
                    300: '#81C784',
                    400: '#66BB6A',
                    500: '#4CAF50',
                    600: '#43A047',
                    700: '#388E3C',
                    800: '#2E7D32',
                    900: '#1B5E20',
                },
                // Accent: Orange/Yellow (Warmth theme)
                accent: {
                    50: '#FFF3E0',
                    100: '#FFE0B2',
                    200: '#FFCC80',
                    300: '#FFB74D',
                    400: '#FFA726',
                    500: '#FF9800',
                    600: '#FB8C00',
                    700: '#F57C00',
                    800: '#EF6C00',
                    900: '#E65100',
                },
                // Additional colors
                dalat: {
                    pine: '#2D5A27',    // Pine forest green
                    fog: '#E8E8E8',     // Foggy morning
                    flower: '#E91E63',  // Flower festival pink
                    coffee: '#4E342E',  // Coffee brown
                    sunset: '#FF5722',  // Sunset orange
                }
            },
            // Custom fonts
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            // Custom animations
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'bounce-slow': 'bounce 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            // Custom shadows
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'card': '0 4px 15px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
            },
            // Glassmorphism effect
            backdropBlur: {
                'glass': '10px',
            },
        },
    },
    plugins: [],
}
