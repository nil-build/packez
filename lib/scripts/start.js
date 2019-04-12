
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _initConfig = _interopRequireDefault(require("../initConfig"));

var _checkDeps = _interopRequireDefault(require("../checkDeps"));

var _webpack = _interopRequireDefault(require("../webpack/webpack.config"));

var _run = _interopRequireDefault(require("./run"));

function _default(entry, output, opts = {}) {
  opts = _lodash.default.omit(opts, ['devServer']);
  const config = (0, _initConfig.default)(entry, output, opts);
  (0, _checkDeps.default)(config);
  const webpackConfig = (0, _webpack.default)(config);

  _fsExtra.default.ensureDirSync(webpackConfig.output.path);

  if (config.clear) {
    _fsExtra.default.emptyDirSync(webpackConfig.output.path);
  } //config.watch


  (0, _run.default)(_lodash.default.defaultsDeep(webpackConfig, {
    watch: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: undefined
    }
  }));
}