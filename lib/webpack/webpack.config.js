
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

const path = require('path');

const webpackModule = require("./webpack.config.module");

const webpackPlugins = require("./webpack.config.plugins");

const webpackOptimization = require("./webpack.config.optimization");

const merge = require("../merge");

module.exports = function (cfg) {
  const assestJs = cfg.assest.js;
  const options = {
    context: cfg.cwd,
    mode: cfg.mode,
    devtool: cfg.devtool,
    //测试环境用eval 提高编译速度 //"source-map",
    entry: function (entries) {
      const entry = {};
      (0, _keys.default)(entries).forEach(key => {
        entry[key] = cfg.polyfills ? [].concat(cfg.polyfills, entries[key]) : [].concat(entries[key]);
      });
      return entry;
    }(cfg.appEntry),
    output: merge({
      path: cfg.appOutputDir,
      filename: path.join(assestJs.output, assestJs.name),
      chunkFilename: path.join(assestJs.output, assestJs.chunkName),
      publicPath: cfg.publicUrl
    }, cfg.output || {}),
    module: webpackModule(cfg),
    plugins: webpackPlugins(cfg),
    optimization: webpackOptimization(cfg),
    externals: cfg.externals,
    resolve: cfg.resolve,
    performance: cfg.performance,
    target: cfg.target
  };
  return options;
};