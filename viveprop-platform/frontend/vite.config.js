import { defineConfig } from 'vite'

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: isVercel ? 'dist' : '../backend/static',
    emptyOutDir: true,
  },
  server: {
    port: 5176,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
