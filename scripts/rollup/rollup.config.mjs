import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import pkg from '../../package.json' with { type: "json" };

const dependencies = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
const isExternal = (moduleName) => moduleName.startsWith('node:') || dependencies.findIndex((dependency) => moduleName.startsWith(dependency) && moduleName !== 'tslib') !== -1;

export default [
	{
		input: path.join(process.cwd(), 'src/index.ts'),
		output: {
			file: path.join(process.cwd(), pkg.exports['.']),
			format: 'esm',
		},
		external: isExternal,
		plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
	},
	{
		input: path.join(process.cwd(), 'src/index.ts'),
		output: {
			file: path.join(process.cwd(), pkg.types),
			format: 'es',
		},
		external: isExternal,
		plugins: [dts()],
	},
];
