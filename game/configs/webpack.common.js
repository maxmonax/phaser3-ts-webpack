const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// paths
const __base = path.resolve(__dirname, '..');
const __src = path.resolve(__base, 'src');

module.exports = {
  // entry point
  entry: {
    app: path.resolve(__src, 'index.ts'),
  },

  // general plugins
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__base, 'public'),
          to: './',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'base config',
      template: path.resolve(__src, 'html', 'index.html'),
      filename: 'index.html',
      minify: {
        // collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
  ],

  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: __base,
        configFile: path.join(__base, 'tsconfig.json'),
      }),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  // general rules
  module: {
    rules: [
      // ts files
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // images
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name]-[hash:4][ext]',
        },
      },
      // fonts
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name]-[hash:4][ext]',
        },
      },
    ],
  },

  // end point
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__base, 'build'),
    clean: true,
  },
};
