import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '../backend/',
  plugins: [react()],
  server: {
    proxy: {
      '/guacamole': {
        target: 'http://localhost:8080', // Guacamole server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/guacamole/, ''), // Remove '/guacamole' prefix
        secure: false,
        ws: true, // Enable WebSocket proxying
      },
      '/api': {
        target: 'http://localhost:8080/api', // The backend server
        changeOrigin: true, // Change the origin of the request to match the target
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' from the proxied request
        ws: true, // Enable WebSocket proxying
      },
    },
  },
});
