const path = require('path');
const webpack = require('webpack');
const rootClientDir = path.resolve(__dirname, '../src');
const buildDir = path.resolve(__dirname, '../lib');

module.exports = {
	name: 'tigon',
	target: 'web',
	entry: './tigon.js',
	devtool: 'source-map',
	context: rootClientDir,
	output: {
		path: buildDir,
		publicPath: '/',
		filename: 'js/tigon.js',
		sourceMapFilename: '[file].map'
	},
	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['src', 'node_modules']
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};
