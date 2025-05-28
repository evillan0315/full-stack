import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path'; 
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

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
          target: env.VITE_API_URL,
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
  };
});
