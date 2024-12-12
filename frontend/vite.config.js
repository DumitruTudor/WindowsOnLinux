import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
    },
  },
});
