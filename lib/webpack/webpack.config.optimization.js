
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _lodash = require("lodash");

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

module.exports = function (opts) {
  const shouldUseSourceMap = opts.shouldUseSourceMap;
  const loaders = opts.loaders;
  const isEnvProduction = opts.mode === "production";
  const minimizer = [new _terserWebpackPlugin.default({
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
  })];

  if (loaders.css || loaders.scss || loaders.sass || loaders.less) {
    const OptimizeCSSAssetsPlugin = require(require.resolve("optimize-css-assets-webpack-plugin"));

    const safePostCssParser = require(require.resolve("postcss-safe-parser"));

    minimizer.push(new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parser: safePostCssParser,
        map: shouldUseSourceMap ? {
          inline: false,
          annotation: true
        } : false
      }
    }));
  }

  return (0, _lodash.defaultsDeep)({
    nodeEnv: opts.mode
  }, opts.optimization || {}, {
    minimize: isEnvProduction,
    minimizer: minimizer,
    runtimeChunk: true,
    splitChunks: {
      chunks: "all",
      name: false
    }
  });
};