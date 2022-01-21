const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SRC = path.resolve(__dirname, 'app');
const DEST = path.resolve(__dirname, 'src/main/webapp/js');

module.exports = exports;

const NAME_PORTLET = "app";

module.exports = {
    entry: {
        app: SRC + '/' + NAME_PORTLET + '.jsx'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
        path: DEST,
        filename: NAME_PORTLET + '.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: SRC,
                use: ['babel-loader'],
                exclude: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.(css|scss)$/,
                loader: "style-loader!css-loader"
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=application/font-woff']},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=application/octet-stream']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ['file']},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: ['url?limit=10000&amp;mimetype=image/svg+xml']}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};