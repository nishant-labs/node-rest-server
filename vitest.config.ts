import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globalSetup: './test/globalTestSetup.ts',
		include: ['./test/**/*.{test,spec}.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*'],
		},
	},
});
