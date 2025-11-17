import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai-day/', // GitHub Pages 子路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

