const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const sass = require('sass');

const TITLE = 'MKKP Plakátszerkesztő';
const PROD = process.env.NODE_ENV === 'production';
const DIST_DIR = 'dist';

const plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash'
    }),
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
        template: 'src/views/index.ejs'
    })
];

if (PROD) {
    plugins.push(new FaviconsWebpackPlugin({
        logo: './src/img/kutyafej_icon.png',
        title: TITLE
    }));
}

module.exports = {
    mode: PROD ? 'production' : 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, DIST_DIR),
        filename: '[name].[chunkhash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s?css$/,
                use: [
                    PROD ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern-compiler',
                            implementation: sass,
                            sassOptions: {
                                // This silences deprecation warnings from dependencies like Font Awesome
                                quietDeps: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: 'ejs-loader',
                        options: {
                            // This fixes the build error
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                  filename: 'img/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                  filename: 'fonts/[name][ext][query]'
                }
            }
        ]
    },
    plugins: plugins
};