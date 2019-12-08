"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault.js");

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _getWebpackModules = _interopRequireDefault(require("./getWebpackModules"));

var _getWebpackPlugins = _interopRequireDefault(require("./getWebpackPlugins"));

var _getWebpackOptimization = _interopRequireDefault(require("./getWebpackOptimization"));

module.exports = function (opts) {
  const assestJs = opts.assest.js;
  const isEnvProduction = opts.mode === "production";
  const isEnvDevelopment = opts.mode === "development";
  const options = {
    context: opts.cwd,
    mode: opts.mode,
    bail: isEnvProduction,
    devtool: isEnvProduction ? opts.shouldUseSourceMap ? "source-map" : false : isEnvDevelopment && "cheap-module-source-map",
    entry: opts.entry,
    output: _lodash.default.defaultsDeep({
      path: _path.default.resolve(opts.cwd, opts.outputDir),
      filename: [assestJs.output || ".", assestJs.name].join("/"),
      chunkFilename: [assestJs.output || ".", assestJs.chunkName].join("/"),
      publicPath: opts.publicPath
    }, opts.output || {}),
    module: (0, _getWebpackModules.default)(opts),
    plugins: (0, _getWebpackPlugins.default)(opts),
    optimization: (0, _getWebpackOptimization.default)(opts),
    externals: opts.externals,
    resolve: Object.assign({
      extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"]
    }, opts.resolve),
    performance: opts.performance,
    target: opts.target
  };

  if (opts.node) {
    options.node = opts.node;
  }

  return options;
};