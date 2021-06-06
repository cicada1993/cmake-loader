module.exports =
{
    entry: "./src/loader.js",
    mode: process.env.NODE_ENV,
    target: "node",
    output: {
        clean: true,
        filename: 'cmake-loader.common.js'
    }
}