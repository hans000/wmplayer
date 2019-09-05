const path = require("path")

module.exports = {
  mode: 'development', // development production
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mplayer.js',
    library: {
      root: 'MPlayer',
      amd: 'mplayer',
      commonjs: 'mplayer'
    },
    libraryTarget: 'umd',
  }
}