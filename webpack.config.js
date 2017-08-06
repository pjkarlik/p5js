/* eslint no-console: 0 */
'use strict';
const AutoPrefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');
const pkgInfo = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { name, version, description } = pkgInfo;

fs.writeFileSync('version.json', JSON.stringify({ name, version, description }));
const DEV_PORT = 2020;
const marker = 'debug';

const config = {
  name: 'p5js',
  target: 'web',
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
          /src/
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [AutoPrefixer]
              }
            },
            'less-loader'
          ],
          publicPath: '../'
        })
      },
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
        test: /\.(woff2|woff|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name]_[hash:base64:5].[ext]'
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
    new ExtractTextPlugin({
      filename: `style/[name].${marker}.[contenthash].css`,
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
