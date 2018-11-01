
"use strict";

const merge = require("../merge");

module.exports = function (cfg) {
  const cacheGroups = {};

  if (!cfg.shouldUseSplitChunks) {
    cacheGroups['vendors'] = false;
    cacheGroups['default'] = false;
  }

  return merge({
    nodeEnv: cfg.mode,
    runtimeChunk: cfg.runtimeChunk ? {
      name: entrypoint => `runtime.${entrypoint.name}`
    } : false,
    splitChunks: {
      name: 'commons',
      chunks: 'all',
      // maxAsyncRequests: 5,
      // maxInitialRequests: 5,
      minSize: 30000,
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }, {
    splitChunks: {
      cacheGroups
    }
  }, cfg.optimization);
};