/* eslint-disable lodash/prefer-lodash-method */
const { merge } = require("webpack-merge");
const getWebpackConfig = require("./webpack.base.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

export default (options) => {
  return merge(getWebpackConfig(options), {
    mode: "development",

    devtool: "inline-source-map",

    module: {
      rules: [],
    },

    plugins: [new ReactRefreshWebpackPlugin()],
  });
};
