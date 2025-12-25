/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom Dalat Vibe color palette - "The Misty Atelier"
                background: '#FAFAF9',
                primary: '#587F72',
                accent: '#E09F87',
                foreground: '#2D2D2D',
            },
            fontFamily: {
                // Elegant serif for headings
                tenor: ['"Tenor Sans"', 'sans-serif'],
                // Modern sans for body text
                manrope: ['Manrope', 'sans-serif'],
            },
            aspectRatio: {
                '3/4': '3 / 4',
            },
        },
    },
    plugins: [],
}
