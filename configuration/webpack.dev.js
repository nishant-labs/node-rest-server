const path = require('path');
const merge = require('webpack-merge');
const webpackShared = require('./webpack.shared');

module.exports = merge.smart(webpackShared, {
	mode: 'development',
	devtool: 'source-map',
	watch: true,
	entry: path.join(process.cwd(), 'src/index.js'),
	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: 'index.js',
		library: 'node-rest-server',
		libraryTarget: 'commonjs2',
	},
});
