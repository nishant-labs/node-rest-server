var path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	devtool: 'source-map',
	watch: true,
	externals: [nodeExternals()],
	entry: path.join(process.cwd(), 'src/index.js'),
	output: {
		path: path.join(process.cwd(), 'dist'),
		filename: 'index.js',
		library: 'node-rest-api',
		libraryTarget: 'umd',
		umdNamedDefine: true
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
