import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import tsconfigPaths from 'vite-tsconfig-paths';
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig(() => ({
  // In production we serve our assets with the '/node/v1/' base path.
  base: isProd ? '/node/v1/' : '/',
  optimizeDeps: {
    exclude: ['@wetteyve/scheduler'],
  },
  build: {
    rtarget: 'es2022',
    cssMinify: isProd,
    chunkSizeWarningLimit: 1024, // 1 MB

    rollupOptions: {
      external: [/node:.*/, 'fsevents'],
    },

    assetsInlineLimit: (source: string) => {
      if (source.endsWith('favicon.svg') || source.endsWith('apple-touch-icon.png')) {
        return false;
      }
    },
  },
  plugins: [tailwindcss(), reactRouterDevTools(), reactRouter(), tsconfigPaths(), wasm(), topLevelAwait()],
}));
