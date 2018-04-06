const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = {
    entry: './client/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index_bundle.js'
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [HtmlWebpackPluginConfig]
}