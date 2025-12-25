/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Tourism-inspired vibrant palette
                primary: {
                    50: '#fef3e2',
                    100: '#fde5c4',
                    200: '#fbc989',
                    300: '#f9ad4e',
                    400: '#f79520',  // Warm orange - sunset/adventure
                    500: '#e67e22',
                    600: '#d35400',
                    700: '#a04000',
                    800: '#6d2b00',
                    900: '#3a1600',
                },
                nature: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',  // Fresh green - nature/mountains
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                sky: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',  // Sky blue - da lat sky
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                earth: {
                    50: '#faf8f3',
                    100: '#f5f1e8',
                    200: '#e8dfc8',
                    300: '#d4c4a0',
                    400: '#b8a076',  // Earthy brown - coffee/soil
                    500: '#9d7f55',
                    600: '#7d6544',
                    700: '#5e4c34',
                    800: '#3f3324',
                    900: '#1f1912',
                }
            },
            fontFamily: {
                sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
                display: ['Satisfy', 'cursive'], // For tourism feel
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'rain': 'rain 1s linear infinite',
                'cloud-float': 'cloudFloat 20s ease-in-out infinite',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                rain: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                cloudFloat: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(20px)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-tourism': 'linear-gradient(135deg, #f79520 0%, #22c55e 50%, #38bdf8 100%)',
            },
        },
    },
    plugins: [],
}
