import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { dependencies } from './package.json';

export default defineConfig({
	plugins: [
		dts({
			outDir: 'lib',
			rollupTypes: true,
			include: ['src'],
			insertTypesEntry: true,
			clearPureImport: true,
			copyDtsFiles: true,
			aliasesExclude: [/^@types/],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'NodeRestServer',
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
			formats: ['es', 'cjs'],
		},
		outDir: 'lib',
		minify: false,
		sourcemap: false,
		rollupOptions: {
			external: [...Object.keys(dependencies), /^node:/],
			output: {
				exports: 'named',
			},
		},
	},
	test: {
		globalSetup: './test/globalTestSetup.ts',
		include: ['./test/**/*.{test,spec}.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*'],
		},
	},
});
