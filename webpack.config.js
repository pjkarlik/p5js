/* eslint no-console: 0 */
'use strict';
const fs = require('fs');
const path = require('path');
const pkgInfo = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { name, version, description } = pkgInfo;

fs.writeFileSync('version.json', JSON.stringify({ name, version, description }));
const DEV_PORT = 2020;
const marker = 'debug';

const config = {
  name: 'p5js',
  target: 'web',
  mode: 'development',
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: DEV_PORT,
    historyApiFallback: true
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: `[name].${marker}.js`,
    chunkFilename: `[id].${marker}.js`,
    libraryTarget: 'umd'
  },
  entry: {
    main: './src/index.js',
    vendor: [
      'babel-polyfill'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          /src/, /resources/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
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
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      // Image loading //
      {
        test: /\.(png|gif|cur|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]__[hash:base64:5].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 7
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      css: 'styles/styles.css',
      title: 'p5js',
      favicon: './resources/images/favicon.png',
      template: './resources/templates/template.ejs',
      inject: 'body',
      hash: true
    })
  ]
};

module.exports = config;
