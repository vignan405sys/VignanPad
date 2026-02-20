import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for deployment: use BASE_PATH env for subpath (e.g. GitHub Pages)
// Root deploy (Vercel, Netlify): leave unset → '/'
// GitHub Pages (user.github.io/repo): set BASE_PATH=/repo-name/
const base = process.env.BASE_PATH || '/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('monaco') || id.includes('@monaco-editor')) return 'monaco';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('peerjs')) return 'peerjs';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
