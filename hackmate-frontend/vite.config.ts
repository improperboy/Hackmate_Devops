import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/users': 'http://localhost:8000',
      '/teams': 'http://localhost:8000',
      '/scores': 'http://localhost:8000',
      '/rounds': 'http://localhost:8000',
      '/rankings': 'http://localhost:8000',
      '/submissions': 'http://localhost:8000',
      '/notifications': 'http://localhost:8000',
      '/announcements': 'http://localhost:8000',
      '/support': 'http://localhost:8000',
      '/chatbot': 'http://localhost:8000',
      // Only proxy actual admin API sub-paths, not the /admin SPA routes
      '^/admin/(analytics|settings|venue|export|recommendations|activity-logs|themes)': {
        target: 'http://localhost:8000',
        rewrite: (path) => path,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
        },
      },
    },
  },
})