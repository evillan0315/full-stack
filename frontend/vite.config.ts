import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' }); // or '../.env'
export default defineConfig(() => {
  return {
    plugins: [solid()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: 'Terminal',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      outDir: '../public/assets',
      target: 'esnext',
      assetsInlineLimit: 0,
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      cors: {
        origin: ['*'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    },
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
    },
  };
});

