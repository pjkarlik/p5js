
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const pkgInfo = require('./package.json');
const { name, version, description } = pkgInfo;
const fs = require('fs');
fs.writeFileSync('version.json', JSON.stringify({ name, version, description }));

const config = {
  name: 'p5js',
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  entry: './src/index.js',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: [/src/],
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        loader: 'style!css',
        include: [/resources/],
      },
      {
        extractTextPlugin: true,
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!less',
        { publicPath: '../' }),
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file',
      },
      {
        test: /\.(wav)$/,
        loader: 'file',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    preLoaders: [
      { test: /\.js$/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('style/style.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      css: 'styles/styles.css',
      title: 'p5js',
      favicon: './resources/images/favicon.png',
      template: './resources/templates/template.ejs',
      inject: 'body',
      hash: true,
    }),
  ],
};

module.exports = config;
