import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { richI18n } from './src/lib/i18n/vite/plugin.js';
import { i18nConfig } from './src/lib/i18n/config.js';

export default defineConfig({
	plugins: [
		richI18n({ locales: i18nConfig.locales }),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	]
});
