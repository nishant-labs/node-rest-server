const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	externals: [nodeExternals()],
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
