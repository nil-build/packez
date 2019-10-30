
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initConfig;

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _config = _interopRequireDefault(require("./config"));

// import path from "path";
function initConfig(entry = "./src/index.js", outputDir = "dist", opts = {}) {
  if (arguments.length === 1 && (0, _isObject.default)(entry)) {
    opts = entry;
    entry = "./src/index.js";
    outputDir = "dist";
  }

  const options = (0, _config.default)(opts);
  let entries = options.entry || entry;

  if (typeof entry === "string" || Array.isArray(entry)) {
    entries = {
      index: entry
    };
  }

  options.entry = entries;
  options.outputDir = options.outputDir || outputDir;
  let polyfills = options.polyfills;

  if (polyfills) {
    polyfills = Array.isArray(polyfills) ? polyfills : [polyfills];
  } else {
    polyfills = [];
  }

  Object.keys(entries).forEach(key => {
    entries[key] = [].concat(polyfills, entries[key]);
  });
  return options;
}