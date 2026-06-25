import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/framer-motion/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'lucide'
          }
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
