const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    app: ['./src/ts/index.tsx', './src/scss/index.scss'],
  },
  target: ['web', 'es5'],
  plugins: [
    new webpack.ProgressPlugin(),
    new Dotenv({
      path: './.env',
      safe: true,
      systemvars: true,
    }),
    new ESLintPlugin({ emitError: true, failOnError: true }),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: './css/bundle.css' }),
    new CopyPlugin({ patterns: [{ from: './public', to: path.resolve(__dirname, 'build') }] }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js(\?.*)?$/i,
    }),
  ],
  output: {
    filename: './js/bundle.js',
    path: path.join(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(html|png|jpg|jpeg|svg|ttf|otf|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
            loader: 'sass-loader',
            options: {
              api: 'modern',
              sassOptions: {
                silenceDeprecations: ["import", "color-functions"],
                fiber: false,
                quietDeps: true, // Suppress deprecation warnings from dependencies
                logger: {
                  warn: function(message) {
                    return null;  // Silence warning messages
                  },
                  debug: function(message) {
                    return null;  // Silence debug messages
                  }
                }
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss', '.ts', '.tsx'],
  },
};
