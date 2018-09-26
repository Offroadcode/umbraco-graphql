var webpack = require("webpack");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: "./assets/js/app.js",
    output: {
        filename: "./assets/js/bundle.js"
    },
	
	externals: {
	},
	
	module: {
        loaders:  [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-2']
                }
            }
        ]
    }

	// Prod:
	devtool: "eval"
}