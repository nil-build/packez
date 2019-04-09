
"use strict";

var _lodash = require("lodash");

module.exports = function (opts) {
  return (0, _lodash.defaultsDeep)({
    nodeEnv: opts.mode
  }, opts.optimization || {}, {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      name: false
    }
  });
};