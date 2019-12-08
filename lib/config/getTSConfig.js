"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTSCompilerOptions = getTSCompilerOptions;
exports.getTSConfigFilePath = getTSConfigFilePath;
exports.default = getTSConfig;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

const tsConfig = require("./tsconfig");

function getTSCompilerOptions(options) {
  const config = getTSConfig(options);
  return config.compilerOptions;
}

function getTSConfigFilePath(options) {
  const filePath = _path.default.resolve(options.cwd, "tsconfig.json");

  if (!_fsExtra.default.existsSync(filePath)) {
    _fsExtra.default.writeFileSync(filePath, JSON.stringify(tsConfig, null, 2));
  }

  return filePath;
}

function getTSConfig(options) {
  let customizeConfig = {};

  const configPath = _path.default.join(options.cwd, "tsconfig.json");

  if (_fsExtra.default.existsSync(configPath)) {
    customizeConfig = require(configPath) || {};
  }

  return Object.assign({}, tsConfig, {}, customizeConfig, {
    compilerOptions: Object.assign({}, tsConfig.compilerOptions, {}, options.tsCompilerOptions, {}, customizeConfig.compilerOptions)
  });
}