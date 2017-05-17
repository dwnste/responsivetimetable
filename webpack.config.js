/* eslint-disable global-require */
const path = require('path');

module.exports = {
    entry: {
        index: [
            path.join(__dirname, './src/js/app.js'),
        ],
    },
    output: {
        path: path.join(__dirname, './dist/'),
        publicPath: '/dist/',
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('postcss-cssnext')
                        ]
                    },
                },
            ],
        }],
    },
    devtool: 'source-map'
};