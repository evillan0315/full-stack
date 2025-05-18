import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
export default defineConfig({
    plugins: [solidPlugin()],
    publicDir: false,
    build: {
        lib: {
            entry: path.resolve(__dirname, 'index.tsx'),
            name: 'SolidApp',
            formats: ['es'],
            fileName: () => 'index.js',
        },
        outDir: '../public/assets',
        target: 'esnext',
        assetsInlineLimit: 0,
        emptyOutDir: true,
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
        allowedHosts: ['board-api.duckdns.org'],
    },
});
