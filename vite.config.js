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
  },
})
