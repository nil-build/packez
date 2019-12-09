"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _webpackBundleAnalyzer = require("webpack-bundle-analyzer");

var _build = _interopRequireDefault(require("./build"));

function _default(entry, output, opts = {}) {
  opts.pluginExtra = opts.pluginExtra || [];
  opts.pluginExtra.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin());
  (0, _build.default)(entry, output, opts);
}