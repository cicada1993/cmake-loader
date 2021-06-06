const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getHostIP } = require('./src/tool')
module.exports =
{
    entry: "./src/main.js",
    mode: process.env.NODE_ENV,
    output: {
        clean: true,
    },
    devServer: {
        compress: true,
        host: getHostIP(),
        port: 9000,
    },
    resolve: {
        extensions: ['.js', '.json', '.wasm', '.ts', '.cm.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\.cm.js$/
            },
            {
                test: /\.cm.js$/,
                use: {
                    loader: path.resolve(__dirname, './src/loader.js'),
                    options: {
                        emsdk: {
                            win32: "D:\\emsdk",
                            linux: "/home/kotlinrust/Apps/emsdk"
                        }
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                type: 'asset/resource'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
}