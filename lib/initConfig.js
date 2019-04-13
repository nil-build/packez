
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = initConfig;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("./config"));

function initConfig(entry = './src/index.js', outputDir = 'dist', opts = {}) {
  const options = (0, _config.default)(opts);
  let entries = entry;

  if (typeof entry === 'string' || (0, _isArray.default)(entry)) {
    entries = {
      index: entry
    };
  }

  outputDir = _path.default.resolve(options.cwd, outputDir);
  options.outputDir = outputDir;
  options.entry = {};
  const polyfills = [];
  (0, _keys.default)(options.polyfills).forEach(name => {
    if (options.polyfills[name]) {
      polyfills.push(require.resolve(`./polyfills/${name}.js`));
    }
  });
  (0, _keys.default)(entries).forEach(key => {
    options.entry[key] = polyfills.concat(entries[key]);
  });
  return options;
}