const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				enforce: 'pre',
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
