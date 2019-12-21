"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _initConfig = _interopRequireDefault(require("../initConfig"));

var _checkDeps = _interopRequireDefault(require("../checkDeps"));

var _webpack = _interopRequireDefault(require("../webpack/webpack.config"));

var _webpackRun = _interopRequireDefault(require("../utils/webpackRun"));

function _default(entry, output, opts = {}) {
  opts.shouldUseEntryHTML = false;
  opts.polyfills = null;
  opts.optimization = {
    runtimeChunk: false,
    splitChunks: false
  };
  opts.babel = Object.assign({
    corejs: false,
    useBuiltIns: false,
    modules: false
  }, opts.babel);
  opts.output = {
    globalObject: "this",
    libraryTarget: "umd",
    library: "MyApp",
    filename: "./[name].js"
  }; // if (opts.mode !== "production") {
  //     opts = _.defaultsDeep({}, opts, {
  //         assest: {
  //             css: {
  //                 name: "[name].css",
  //                 chunkName: "[name].chunk.css"
  //             },
  //             js: {
  //                 name: "[name].js",
  //                 chunkName: "[name].chunk.js"
  //             },
  //             media: {
  //                 name: "[name].[ext]"
  //             }
  //         },
  //         watch: true
  //     });
  // }

  const config = (0, _initConfig.default)(entry, output, opts);
  (0, _checkDeps.default)(config);
  let webpackConfig = (0, _webpack.default)(config); //自定义

  if (_lodash.default.isFunction(config.getWebpackConfig)) {
    webpackConfig = config.getWebpackConfig(webpackConfig);
  }

  _fsExtra.default.ensureDirSync(webpackConfig.output.path);

  if (config.clean) {
    _fsExtra.default.emptyDirSync(webpackConfig.output.path);
  }

  const watch = config.watch;
  const watchOptions = config.watchOptions;
  (0, _webpackRun.default)(Object.assign(webpackConfig, {
    watch,
    watchOptions
  }));
}