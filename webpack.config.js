/* 
    Title : Money Formatter
    Created by : Hadi
    Date: 23/10/2024
    Version: 1.1
*/

// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),  // Output directory
        filename: 'FormatMoney.js',         // Output file name
        library: 'FormatMoney',             // Global variable when used directly in a browser
        libraryTarget: 'umd',                   // UMD format for module definition
        umdNamedDefine: true,                   // Name the AMD module if used in AMD environment
        globalObject: 'this'                    // Ensures proper global object (useful for Node.js)
    },
    // externals: {
    //     jquery: 'jQuery' // Exclude jQuery from the bundle and expect it to be provided externally. If you want to publish this plugin for development, comment this.
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "jquery": require.resolve("jquery")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};