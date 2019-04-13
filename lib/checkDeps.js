
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _child_process = require("child_process");

var _dependencies = _interopRequireDefault(require("./config/dependencies.config"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _os = _interopRequireDefault(require("os"));

/**
 * 获取未安装依赖
 */
function getDeps(opts) {
  const deps = new _set.default();
  const pkgFile = process.cwd() + '/package.json';
  let pkg = {};

  if (_fsExtra.default.existsSync(pkgFile)) {
    pkg = require(pkgFile);
  }

  if (!pkg.browserslist) {
    pkg.browserslist = opts.browserslist;

    _fsExtra.default.writeFileSync(pkgFile, (0, _stringify.default)(pkg, null, 2) + _os.default.EOL);
  }

  const pkgDeps = (0, _assign.default)({}, pkg.dependencies, pkg.devDependencies);
  (0, _keys.default)(opts.loaders).filter(v => opts.loaders[v]).forEach(v => {
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