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
})
