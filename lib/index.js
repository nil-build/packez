
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _path = _interopRequireDefault(require("path"));

const execSync = require('child_process').execSync;

const fs = require("fs-extra");

const dependencies = require("./config/dependencies.config");

const webpackConfig = require("./webpack/webpack.config");

const defaultOptions = require("./defaultOptions");

const log = require("./logger");

const normalizeConfig = defaultOptions;

function _default(entry = './src/index.js', outputDir = 'dist', opts = {}) {
  const options = normalizeConfig(opts);
  let entries = entry;

  if (typeof entry === 'string' || (0, _isArray.default)(entry)) {
    entries = {
      index: entry
    };
  }

  outputDir = _path.default.resolve(options.cwd, outputDir);
  fs.ensureDirSync(outputDir);
  options.outputDir = outputDir;
  installDeps(options);
  options.entry = {};
  (0, _keys.default)(entries).forEach(key => {
    options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key]);
  });
  return webpackConfig(options);
}
/**
 * 获取未安装依赖
 */


function getDepsFromConfig(cfg) {
  cfg = defaultOptions(cfg);
  const deps = new _set.default(dependencies.core);
  const pkgFile = process.cwd() + '/package.json';
  let pkg = {};

  if (fs.existsSync(pkgFile)) {
    pkg = require(pkgFile);
  }

  const pkgDeps = (0, _assign.default)({}, pkg.dependencies, pkg.devDependencies);
  (0, _keys.default)(cfg.module).filter(v => cfg.module[v]).forEach(v => {
    if (dependencies[v]) {
      dependencies[v].forEach(dep => {
        deps.add(dep);
      });
    }
  });
  return [...deps].filter(v => !(v in pkgDeps));
}

function installDeps(cfg) {
  const options = defaultOptions(cfg);
  const deps = getDepsFromConfig(cfg);
  const executor = options.cnpm ? 'cnpm' : 'npm';
  if (!deps.length) return;
  log('开始安装依赖，共计 ' + deps.length + ' 个...');
  const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
  log(cmd);
  execSync(cmd);
  log('依赖安装完成。');
} // function createWebpackConfig(options = {}) {
//     return webpackConfig(defaultOptions(options));
// }
// module.exports = {
//     installDeps,
//     normalizeConfig,
//     getDepsFromConfig,
//     createWebpackConfig
// };