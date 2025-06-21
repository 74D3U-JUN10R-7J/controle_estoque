import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Garante que rotas como /product ou /supplier funcionem em modo SPA
    historyApiFallback: true,
    host: true,
    port: 5173,
    open: true
  },
})