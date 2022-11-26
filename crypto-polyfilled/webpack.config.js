const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    alephium: "./index.js",
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolve: {
    extensions: [".js"],
    fallback: {
      fs: false,
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
    },
  },
  output: {
    filename: "alephium.min.js",
    library: {
      name: "alephium",
      type: "umd",
    },
  },
  optimization: {
    minimize: true,
  },
};
