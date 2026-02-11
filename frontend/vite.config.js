import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Listen on all addresses
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000', // Use IPv4 loopback
                changeOrigin: true,
                secure: false,
            }
        }
    }
})

