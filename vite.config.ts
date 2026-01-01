import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // use relative paths so the app can be served from any path/static host
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    // allow Render preview host and listen on all interfaces
    host: true,
    port: 10000,
    // allow list for preview (helps avoid blocked request from Render)
    allowedHosts: ['mindmap-ui.onrender.com'],
  },
})
