import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external access
    port: 5173,
    strictPort: true,
    https: false, // Vite's built-in HTTPS is unreliable, we'll use ngrok's HTTPS instead
    cors: true,
    hmr: {
      clientPort: 443, // Ensures Hot Module Replacement works with ngrok
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
