const path = require('path'),
      webpack = require('webpack')
      ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['./client/index.js', './client/main.scss'],

    output: {
        path: path.resolve(__dirname, "public/assets"),
        filename: "bundle.js",
        publicPath: "assets"
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            },
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract({
            //         loader: 'css-loader?importLoaders=1'
            //     })
            // },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true,
        })
    ]
}
