import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig(() => ({
  // In production we serve our assets with the /play/v3 base path via Akamai.
  base: isProd ? '/node/v1/' : '/',
  build: {
    rtarget: 'es2022',
		cssMinify: isProd,

		rollupOptions: {
			external: [/node:.*/, 'fsevents'],
		},

		assetsInlineLimit: (source: string) => {
			if (
				source.endsWith('favicon.svg') ||
				source.endsWith('apple-touch-icon.png')
			) {
				return false
			}
		},
  },
  plugins: [tailwindcss(), reactRouterDevTools(), reactRouter(), tsconfigPaths()],
}));
