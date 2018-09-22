const path = require('path');
const merge = require('webpack-merge');
const webpackShared = require('./webpack.shared');

module.exports = merge.smart(webpackShared, {
	mode: 'production',
	entry: path.join(process.cwd(), 'src/index.js'),
	output: {
		path: path.join(process.cwd(), 'lib'),
		filename: 'index.js',
		library: 'node-rest-server',
		libraryTarget: 'commonjs2',
	},
});
