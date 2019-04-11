
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _webpack = _interopRequireDefault(require("webpack"));

var _lodash = _interopRequireDefault(require("lodash"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _logger = _interopRequireDefault(require("../logger"));

var _initConfig = _interopRequireDefault(require("../initConfig"));

var _checkDeps = _interopRequireDefault(require("../checkDeps"));

var _webpack2 = _interopRequireDefault(require("../webpack/webpack.config"));

function _default(entry, output, opts = {}) {
  const watch = opts.watch;
  opts = _lodash.default.omit(opts, ['devServer', 'watch']);
  opts = (0, _initConfig.default)(entry, output, opts);
  (0, _checkDeps.default)(opts);
  const webpackConfig = (0, _webpack2.default)(opts);

  _fsExtra.default.ensureDirSync(webpackConfig.output.path);

  if (opts.clear) {
    _fsExtra.default.emptyDirSync(webpackConfig.output.path);
  }

  const compiler = (0, _webpack.default)(webpackConfig);

  const compilerCb = function (err, stats) {
    if (err) {
      return (0, _logger.default)(err);
    }

    (0, _logger.default)(stats.toString({
      chunks: false,
      colors: true
    }));
  };

  if (watch) {
    compiler.watch({
      aggregateTimeout: 300,
      poll: undefined
    }, compilerCb);
  } else {
    compiler.run(compilerCb);
  }
}