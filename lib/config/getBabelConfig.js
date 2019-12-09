"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelConfig;

var _lodash = _interopRequireDefault(require("lodash"));

function getBabelConfig(options) {
  const plugins = options.plugins || [];
  const presets = options.presets || [];
  return {
    babelrc: _lodash.default.get(options, "babelrc", true),
    configFile: _lodash.default.get(options, "configFile", true),
    compact: _lodash.default.get(options, "compact", false),
    presets: [[require.resolve("babel-preset-packez"), _lodash.default.defaultsDeep({}, _lodash.default.omit(options, ["presets", "plugins", "babelrc", "configFile", "compact"]), {
      corejs: 3,
      useBuiltIns: "usage",
      //entry|usage|false
      loose: true,
      modules: false,
      strictMode: true,
      decoratorsBeforeExport: true
    })], ...presets],
    plugins: [...plugins]
  };
}