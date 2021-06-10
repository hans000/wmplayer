const path = require("path")

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'wmplayer.js',
        library: {
            type: 'umd',
            name: 'wmplayer',
        },
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
        ]
    },
}