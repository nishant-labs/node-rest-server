var path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	externals: [nodeExternals()],
	entry: path.join(process.cwd(), 'src/index.js'),
	output: {
		path: path.join(process.cwd(), 'lib'),
		filename: 'index.js',
		library: 'node-rest-api',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	},
	node: {
		__dirname: false,
		__filename: false
	}
};
