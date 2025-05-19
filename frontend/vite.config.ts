import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path'; // ← Add this line

export default defineConfig((env) => ({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'SolidApp',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: '../public/assets',
    target: 'esnext',
    assetsInlineLimit: 0,
    emptyOutDir: true,
  },
  /*server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
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
  },*/
}));

