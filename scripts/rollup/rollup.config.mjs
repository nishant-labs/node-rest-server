import path from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from '../../package.json' assert { type: "json" };

const dependencies = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
const isExternal = (moduleName) => dependencies.findIndex((dependency) => moduleName.startsWith(dependency)) !== -1;

export default {
	input: path.join(process.cwd(), 'src/index.js'),
	output: {
		file: path.join(process.cwd(), pkg.exports['.']),
		format: 'esm',
		exports: 'named',
	},
	external: isExternal,
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
			inputSourceMap: process.env.NODE_ENV === 'development',
		}),
	],
};
