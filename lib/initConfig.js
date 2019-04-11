
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = initConfig;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _config = _interopRequireDefault(require("./config"));

const path = require('path');

function initConfig(entry = './src/index.js', outputDir = 'dist', opts = {}) {
  const options = (0, _config.default)(opts);
  let entries = entry;

  if (typeof entry === 'string' || (0, _isArray.default)(entry)) {
    entries = {
      index: entry
    };
  }

  outputDir = path.resolve(options.cwd, outputDir);
  options.outputDir = outputDir;
  options.entry = {};
  (0, _keys.default)(entries).forEach(key => {
    options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key]);

    if (options.shouldUseFetch) {
      options.entry[key].unshift(require.resolve("./fetchPolyfills.js"));
    }
  });
  return options;
}