
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initConfig;

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("./config"));

function initConfig(entry = "./src/index.js", outputDir = "dist", opts = {}) {
  const options = (0, _config.default)(opts);
  let entries = entry;

  if (typeof entry === "string" || Array.isArray(entry)) {
    entries = {
      index: entry
    };
  }

  options.outputDir = outputDir;
  options.entry = {};
  let polyfills = options.polyfills;

  if (polyfills) {
    polyfills = Array.isArray(polyfills) ? polyfills : [polyfills];
  } else {
    polyfills = [];
  }

  Object.keys(entries).forEach(key => {
    options.entry[key] = [].concat(polyfills, entries[key]);
  });
  return options;
}