const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'production',
    module: {
        rules: [
            {
              test: '/\.js$/',
              exclude: /node_modules/,
              loader: "babel-loader"
            },
            {
              test: /\.(css|scss)$/,
              use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
            {
              test: /\.(png|jpe?g|gif|svg)$/i,
              loader: 'file-loader',
              options: {
                outputPath: 'media',
              },
            },
            {
              test: /\.html$/i,
              loader: 'html-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new WorkboxPlugin.GenerateSW(),
        new MiniCssExtractPlugin({filename: '[name].css'})
    ]
}
