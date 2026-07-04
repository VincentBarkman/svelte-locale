import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		environment: 'node'
	},
	resolve: {
		alias: {
			'$app/environment': path.resolve(__dirname, 'tests/stubs/environment.ts'),
			'$app/navigation': path.resolve(__dirname, 'tests/stubs/navigation.ts'),
			'$app/stores': path.resolve(__dirname, 'tests/stubs/stores.ts'),
			'./state.svelte.js': path.resolve(__dirname, 'tests/stubs/state.ts'),
			'./state.svelte': path.resolve(__dirname, 'tests/stubs/state.ts')
		}
	}
});
