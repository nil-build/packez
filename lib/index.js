
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

const path = require('path');

const execSync = require('child_process').execSync;

const fs = require("fs-extra");

const dependencies = require("./config/dependencies.config");

const webpackConfig = require("./webpack/webpack.config");

const normalizeConfig = require("./defaultOptions");

const log = require("./logger");

module.exports = function (entry = './src/index.js', outputDir = 'dist', opts = {}) {
  const options = normalizeConfig(opts);
  let entries = entry;

  if (typeof entry === 'string' || (0, _isArray.default)(entry)) {
    entries = {
      index: entry
    };
  }

  outputDir = path.resolve(options.cwd, outputDir);
  fs.ensureDirSync(outputDir);
  options.outputDir = outputDir;
  installDeps(options);
  options.entry = {};
  (0, _keys.default)(entries).forEach(key => {
    options.entry[key] = options.polyfills ? [].concat(options.polyfills, entries[key]) : [].concat(entries[key]);

    if (options.shouldUseFetch) {
      options.entry[key].unshift(require.resolve("./fetchPolyfills.js"));
    }
  });

  if (options.clear) {
    fs.emptyDirSync(outputDir);
  }

  return webpackConfig(options);
};
/**
 * 获取未安装依赖
 */


function getDepsFromConfig(cfg) {
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

function installDeps(options) {
  const deps = getDepsFromConfig(options);
  const executor = options.cnpm ? 'cnpm' : 'npm';
  if (!deps.length) return;
  log('开始安装依赖，共计 ' + deps.length + ' 个...');
  const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
  log(cmd);
  execSync(cmd);
  log('依赖安装完成。');
}