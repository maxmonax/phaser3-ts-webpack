const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// paths
const __base = path.resolve(__dirname, '..');

module.exports = merge(common, {
    // prod mode
    mode: 'production',
    devtool: false,

    // override resolve to use tsconfig.prod.json
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                baseUrl: __base,
                configFile: path.join(__base, 'tsconfig.prod.json')
            })
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    output: {
        filename: '[name].[contenthash:8].js',
        path: path.resolve(__base, 'build'),
        clean: true
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        })
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
                    "css-loader",
                    // Compiles Sass to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            api: "modern",
                        },
                    },
                ],
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin()
        ]
    }
});
