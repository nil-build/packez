
"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _commander = _interopRequireDefault(require("commander"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _lodash = _interopRequireDefault(require("lodash"));

var _package = _interopRequireDefault(require("../package.json"));

var packez = _interopRequireWildcard(require("./index"));

var _logger = _interopRequireDefault(require("./utils/logger"));

_commander.default.version(_package.default.version).option('-w, --watch', '是否监控文件改变').option('-d, --outDir [outDir]', '输出到指定目录，默认为 dist', 'dist').option('-t, --target [target]', '转换目标格式：web | node 默认为 web', /^node|web$/, 'web').option('-c, --clear', '转换前清空输出目录').option('-p, --publicPath [publicPath]', 'publicPath', '').option('-l, --loaders [loaders]').option('--polyfills [polyfills]', '设置polyfills文件,e.g. Promise,Set,Map,raf,fetch', '').option('--cnpm', '使用cnpm安装依赖').option('--corejs [corejs]', '参考 babel-runtime', true).option('--helpers [helpers]', '参考 babel-runtime', true).option('--regenerator [regenerator]', '参考 babel-runtime', true).parse(process.argv);

const options = {
  watch: _lodash.default.get(_commander.default, 'watch', false),
  target: _lodash.default.get(_commander.default, 'target', 'web'),
  clear: _lodash.default.get(_commander.default, 'clear', true),
  cnpm: _lodash.default.get(_commander.default, 'cnpm', false),
  publicPath: _lodash.default.get(_commander.default, 'publicPath', ''),
  corejs: _lodash.default.get(_commander.default, 'corejs', true),
  helpers: _lodash.default.get(_commander.default, 'helpers', true),
  regenerator: _lodash.default.get(_commander.default, 'regenerator', true),
  loaders: _lodash.default.get(_commander.default, 'loaders', '')
};
const polyfills = {};

const polyfillsStr = _lodash.default.get(_commander.default, 'polyfills', '');

const validExecuors = ['start', 'build', 'server', 'analyzer'];
const args = _commander.default.args;

const outputDir = _lodash.default.get(_commander.default, 'outDir', 'dist');

let entry = './src/index.js';
let executor = 'start';

if (args[0] === 'init') {
  const pkgFile = process.cwd() + '/package.json';
  const scripts = _package.default.scripts;

  _fsExtra.default.writeFileSync(_path.default.resolve(process.cwd(), 'packez.config.js'), _fsExtra.default.readFileSync(__dirname + '/packez.config.ejs'));

  if (!scripts.start) {
    scripts.start = "packez start ./src/index.js -w -c";
    (0, _logger.default)(`add scripts.start = ${scripts.start} successfully.`);
  }

  if (!scripts.build) {
    scripts.build = "packez build ./src/index.js -c";
    (0, _logger.default)(`add scripts.build = ${scripts.build} successfully.`);
  }

  if (!scripts.server) {
    scripts.server = "packez server ./src/index.js -c";
    (0, _logger.default)(`add scripts.server = ${scripts.server} successfully.`);
  }

  if (!scripts.analyzer) {
    scripts.analyzer = "packez analyzer ./src/index.js -c";
    (0, _logger.default)(`add scripts.analyzer = ${scripts.analyzer} successfully.`);
  }

  (0, _logger.default)(`add packez.config.js successfully.`);

  _fsExtra.default.writeFileSync(pkgFile, (0, _stringify.default)(_package.default, null, 2) + _os.default.EOL);

  process.exit(1);
}

if (polyfillsStr) {
  polyfillsStr.split(',').forEach(key => {
    polyfills[key] = true;
  });
}

if (args.length === 1) {
  if (validExecuors.indexOf(args[0]) === -1) {
    entry = args[0];
  }
} else if (args.length > 1) {
  executor = args[0];
  entry = args[1];
}

if (validExecuors.indexOf(executor) === -1) {
  throw new Error(`packez method ${executor} not exists! you may use start,build,server,analyzer`);
}

if (!_fsExtra.default.existsSync(entry)) {
  throw new Error(`entry file [${entry}] not exists!`);
}

const stats = _fsExtra.default.statSync(entry);

if (stats.isDirectory()) {
  const entries = {};

  const results = _fsExtra.default.readdirSync(entry);

  results.forEach(file => {
    if (/\.m?jsx?$/.test(file)) {
      entries[file] = _path.default.resolve(entry, file);
    }
  });
  entry = entries;
}

packez[executor](entry, outputDir, {
  method: executor,
  publicPath: options.publicPath,
  watch: options.watch,
  target: options.target,
  cnpm: options.cnpm,
  clear: options.clear,
  polyfills,
  loaders: {
    babel: {
      runtimeOptions: {
        corejs: options.corejs ? 2 : false,
        helpers: options.helpers,
        regenerator: options.regenerator
      }
    },
    scss: options.loaders.indexOf('scss') !== -1,
    sass: options.loaders.indexOf('sass') !== -1,
    less: options.loaders.indexOf('less') !== -1,
    vue: options.loaders.indexOf('vue') !== -1
  },
  program: _commander.default
});