const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin-legacy');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const TITLE = 'MKKP Plakátszerkesztő';

const PROD = process.env.NODE_ENV === 'production';
const DIST_DIR = 'dist';

const extractSass = new ExtractTextPlugin({
    filename: "[name].[hash].css"
});

const plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash'
    }),
    extractSass,
    new HtmlWebpackPlugin({
        template: 'src/views/index.ejs'
    })
];

if(PROD) {
    plugins.push(new TerserPlugin());
    plugins.push(new CleanWebpackPlugin([DIST_DIR]));
    plugins.push(new FaviconsWebpackPlugin({
        logo: './src/img/kutyafej_icon.png',
        title: TITLE
    }));
}

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, DIST_DIR),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.ejs$/,
                use: [
                    'ejs-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[hash].[ext]',
                        outputPath: 'img/',    // where the fonts will go
                        publicPath: './'       // override the default path
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',    // where the fonts will go
                        publicPath: './'       // override the default path
                    }
                }]
            }
        ]
    },
    plugins: plugins
};
