const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const prod = {
    mode: 'production',
    output: {
        publicPath: '../../',
    },
    plugins: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin(),
    ],
};

module.exports = merge(base, prod);