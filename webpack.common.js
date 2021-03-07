const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const packageInfo = require('./package.json');
const path = require('path');

module.exports = {
    entry: {
        main: './js/index.js',
        'contrast-ratio-auto-extraction-worker': './js/contrast-ratio-auto-extraction-worker-index.js'
    },
    output: {
        filename: './color-picker/js/[name].js',
        path: path.resolve(__dirname, 'dist/'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        }
                    },
                    'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'color-picker/[hash][ext]' + '?q=' + packageInfo.version
                }
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './html/index.html', to: './color-picker' },
                { from: './assets/favicon.ico', to: './color-picker' }
            ],
        })
    ]
};
