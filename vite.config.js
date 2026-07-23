import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-recovered',
  },
  server: { port: 5173 },
  preview: { port: 4174 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
