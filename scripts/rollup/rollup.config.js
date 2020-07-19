const path = require('path');

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from '../../package.json';

const dependencies = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
const isExternal = (moduleName) => dependencies.findIndex((dependency) => moduleName.startsWith(dependency)) !== -1;

export default {
	input: path.join(process.cwd(), 'src/index.js'),
	output: [
		{
			file: path.join(process.cwd(), pkg.main),
			format: 'cjs',
			exports: 'named',
		},
		{
			file: path.join(process.cwd(), pkg.module),
			format: 'esm',
			exports: 'named',
		},
	],
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
