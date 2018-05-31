const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');

const devMode = process.env.NODE_ENV !== 'production';

let entryPath = `./src/pages/**/index.js`;

let argv = JSON.parse(process.env.npm_config_argv).original;
let configPage = argv[argv.length - 1];
if (configPage && /^--/.test(configPage)) {
    configPage = configPage.replace(/^--/, '');
    entryPath = entryPath.replace('**', configPage);
}

const js = glob.sync(entryPath).reduce((prev, curr) => {
    prev[curr.slice(6, -3)] = [curr];
    return prev;
}, {});

const chunks = Object.keys(js);
const html = [];

chunks.forEach(name => {
    const config = {
        data: {},
        filename: `${name}.html`,
        template: `ejs-compiled-loader!./src/${name}.html`,
        inject: true,
        minify: {
            minifyJS: true,
        },
        chunks: [name],
    };
    html.push(new HtmlWebpackPlugin(config));
});

const base = {
    entry: js,
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: devMode ? '[name].js': '[name][chunkhash:8].js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory',
            },
            {
                test: /\.css$/,
                // loader: 'style-loader!css-loader!postcss-loader',
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.scss$/,
                // loader: 'style-loader!css-loader!postcss-loader!sass-loader',
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader?name=[hash:8].[ext]',
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
            },
        }),
    ].concat(html).concat([
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name][chunkhash:8].css',
        }),
    ]),
    resolve: {
        alias: {
            common: path.resolve(__dirname, '../src/common'),
        }
    },
};

module.exports = base;