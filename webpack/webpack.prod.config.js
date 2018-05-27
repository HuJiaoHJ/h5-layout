const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const prod = {
    mode: 'production',
    plugins: [
        new UglifyJsPlugin(),
    ],
};

module.exports = merge(base, prod);