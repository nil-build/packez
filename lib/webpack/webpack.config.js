
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

const path = require('path');

const webpackModule = require("./webpack.config.module");

const webpackPlugins = require("./webpack.config.plugins");

const webpackOptimization = require("./webpack.config.optimization");

const merge = require("../merge");

module.exports = function (cfg) {
  const assestJs = cfg.assest.js;
  const entryJs = !(0, _isArray.default)(cfg.appEntryJs) ? [cfg.appEntryJs] : cfg.appEntryJs; //process.env.NODE_ENV = cfg.mode;//??

  const options = {
    context: cfg.appPath,
    mode: cfg.mode,
    devtool: cfg.devtool,
    //测试环境用eval 提高编译速度 //"source-map",
    entry: cfg.entry || {
      app: [].concat(cfg.appPolyfills || [], entryJs.map(entry => path.resolve(cfg.appPath, cfg.appSrc, entry)))
    },
    output: merge({
      path: path.resolve(cfg.appPath, cfg.appDist),
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