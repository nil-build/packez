"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _child_process = require("child_process");

var _dependencies = _interopRequireDefault(require("./config/dependencies.config"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _os = _interopRequireDefault(require("os"));

/**
 * 获取未安装依赖
 */
function getDeps(opts) {
  const deps = new Set();
  const pkgFile = process.cwd() + '/package.json';
  let pkg = {};

  if (_fsExtra.default.existsSync(pkgFile)) {
    pkg = require(pkgFile);
  }

  if (!pkg.browserslist) {
    pkg.browserslist = opts.browserslist;

    _fsExtra.default.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + _os.default.EOL);
  }

  const pkgDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
  Object.keys(opts.loaders).filter(v => opts.loaders[v]).forEach(v => {
    if (_dependencies.default[v]) {
      _dependencies.default[v].forEach(dep => {
        deps.add(dep);
      });
    }
  });
  return [...deps].filter(v => !(v in pkgDeps));
}

function _default(opts) {
  const deps = getDeps(opts);
  const executor = opts.cnpm ? 'cnpm' : 'npm';
  if (!deps.length) return;
  (0, _logger.default)('开始安装依赖，共计 ' + deps.length + ' 个...');
  const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
  (0, _logger.default)(cmd);
  (0, _child_process.execSync)(cmd);
  (0, _logger.default)('依赖安装完成。');
}