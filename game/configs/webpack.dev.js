const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// paths
const __base = path.resolve(__dirname, '..');

module.exports = merge(common, {

    // dev mode
    mode: 'development',
    devtool: 'inline-source-map',

    // dev server
    devServer: {
        port: 9100,
        static: path.resolve(__base, 'public'),
        hot: true,
        client: {
            overlay: true
        }
    },

    // general rules
    module: {
        rules: [
            // css|sass files
            {
                test: /\.(css|scss|sass)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
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

});
