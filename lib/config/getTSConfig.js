"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTSCompilerOptions = getTSCompilerOptions;
exports.getTSConfigFilePath = getTSConfigFilePath;
exports.default = getTSConfig;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

const tsConfig = require("./tsconfig.json");

function getTSCompilerOptions(options) {
  const config = getTSConfig(options);
  return config.compilerOptions;
}

function getTSConfigFilePath(options) {
  let filePath = _path.default.resolve(options.cwd, "tsconfig.json");

  if (!_fsExtra.default.existsSync(filePath)) {
    filePath = _path.default.resolve(__dirname, "./tsconfig.json");
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