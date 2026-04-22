const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// paths
const __base = path.resolve(__dirname, '..');

module.exports = (env = {}) =>
  merge(common, {
    // prod mode
    mode: 'production',
    devtool: false,

    // override resolve to use tsconfig.prod.json
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          baseUrl: __base,
          configFile: path.join(__base, 'tsconfig.prod.json'),
        }),
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    output: {
      filename: '[name].[contenthash:4].js',
      path: path.resolve(__base, 'build'),
      clean: true,
    },

    plugins: [
      new webpack.DefinePlugin({ __DEV__: JSON.stringify(false) }),
      new MiniCssExtractPlugin({
        filename: 'css/main.css',
      }),
      ...(env.analyze ? [new BundleAnalyzerPlugin()] : []),
    ],
    module: {
      rules: [
        // css|sass files
        {
          test: /\.(css|scss|sass)$/i,
          use: [
            // minificator
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          phaser: {
            test: /[\\/]node_modules[\\/]phaser[\\/]/,
            name: 'phaser',
            filename: 'js/phaser.[contenthash:4].js',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  });
