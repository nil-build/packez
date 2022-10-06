const paths = require("./paths");
const { merge } = require("webpack-merge");
const getWebpackConfig = require("./webpack.base.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (options = {}) => {
  return merge(getWebpackConfig(options), {
    mode: "production",
    devtool: false,
    output: {
      path: paths.build,
      publicPath: "/",
      filename: "static/js/[name].[contenthash:8].bundle.js",
      ...options.output,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[id].[contenthash:8].css",
      }),
    ],
    module: {
      rules: [],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      runtimeChunk: {
        name: "runtime",
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  });
};
