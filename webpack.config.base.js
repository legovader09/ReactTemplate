const path = require('path');
const webpack = require('webpack');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  target: ['web', 'es5'],
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new StylelintPlugin(),
    new ESLintPlugin({ emitError: true, failOnError: true }),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: './css/[name].bundle.css' }),
    new CopyPlugin({ patterns: [{ from: "./public", to: "./" }] })
  ],
  output: {
    filename: './js/[name].bundle.js',
    path: path.join(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader, // extract CSS into files
          {
            loader: 'css-loader', // turns CSS into CommonJS
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                parser: 'postcss-scss',
                plugins: ['postcss-preset-env'],
              },
            },
          },
          {
            loader: 'sass-loader', // turns SASS into CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss'],
  },
};