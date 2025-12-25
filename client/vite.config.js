import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration
 * Smart Da Lat Tourism - Client
 * 
 * Configured with React plugin and proxy to backend API
 */
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        // Proxy API requests to backend during development
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    }
})
