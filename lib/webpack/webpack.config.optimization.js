
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _lodash = require("lodash");

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _optimizeCssAssetsWebpackPlugin = _interopRequireDefault(require("optimize-css-assets-webpack-plugin"));

var _postcssSafeParser = _interopRequireDefault(require("postcss-safe-parser"));

module.exports = function (opts) {
  const shouldUseSourceMap = opts.shouldUseSourceMap;
  const isEnvProduction = opts.mode === "production";
  return (0, _lodash.defaultsDeep)({
    nodeEnv: opts.mode
  }, opts.optimization || {}, {
    minimize: isEnvProduction,
    minimizer: [new _terserWebpackPlugin.default({
      terserOptions: {
        parse: {
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true
        }
      },
      parallel: true,
      cache: true,
      sourceMap: shouldUseSourceMap
    }), new _optimizeCssAssetsWebpackPlugin.default({
      cssProcessorOptions: {
        parser: _postcssSafeParser.default,
        map: shouldUseSourceMap ? {
          inline: false,
          annotation: true
        } : false
      }
    })],
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
      name: false
    }
  });
};