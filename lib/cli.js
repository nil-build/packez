"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _commander = _interopRequireDefault(require("commander"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _lodash = _interopRequireDefault(require("lodash"));

var _package = _interopRequireDefault(require("../package.json"));

var packez = _interopRequireWildcard(require("./index"));

var _logger = _interopRequireDefault(require("./utils/logger"));

_commander.default.version(_package.default.version).option("-w, --watch", "是否监控文件改变").option("-d, --outDir [outDir]", "输出到指定目录，默认为 dist", "dist").option("-t, --target [target]", "转换目标格式：web | node 默认为 web", /^node|web$/, "web").option("-c, --clean", "转换前清空输出目录").option("-p, --publicPath [publicPath]", "publicPath", "").option("-l, --loaders [loaders]").option("--config [config]", "configFile", "./packez.config.js").option("--state [state]", "state", "").parse(process.argv);

const options = {
  watch: _lodash.default.get(_commander.default, "watch", false),
  target: _lodash.default.get(_commander.default, "target", "web"),
  clean: _lodash.default.get(_commander.default, "clean", false),
  publicPath: _lodash.default.get(_commander.default, "publicPath", ""),
  state: _lodash.default.get(_commander.default, "state", "")
};
const validExecuors = ["start", "build", "server", "analyzer", "bundle"];
const args = _commander.default.args;

const outputDir = _lodash.default.get(_commander.default, "outDir", "dist");

let entry = "./src/index.js";
let executor = "start";

if (args[0] === "init") {
  const pkgFile = process.cwd() + "/package.json";
  let userPkg = {};

  if (_fsExtra.default.existsSync(pkgFile)) {
    userPkg = require(pkgFile);
  }

  const scripts = userPkg.scripts || {};
  userPkg.scripts = scripts;

  if (!_fsExtra.default.existsSync(_path.default.resolve(process.cwd(), "packez.config.js"))) {
    _fsExtra.default.writeFileSync(_path.default.resolve(process.cwd(), "packez.config.js"), _fsExtra.default.readFileSync(__dirname + "/packez.config.template.js"));
  }

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

  _fsExtra.default.writeFileSync(pkgFile, JSON.stringify(userPkg, null, 2) + _os.default.EOL);

  process.exit(1);
}

let isShortCmd = false;

if (args.length === 1) {
  if (validExecuors.indexOf(args[0]) === -1) {
    entry = args[0];
  } else {
    isShortCmd = true;
  }
} else if (args.length > 1) {
  executor = args[0];
  entry = args[1];
}

if (validExecuors.indexOf(executor) === -1) {
  throw new Error(`packez method ${executor} not exists! you may use start,build,server,analyzer,bundle`);
}

if (!isShortCmd) {
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
}

packez[executor](entry, outputDir, {
  configFile: _commander.default.config,
  method: executor,
  publicPath: options.publicPath,
  watch: options.watch,
  target: options.target,
  clean: options.clean,
  state: options.state,
  program: _commander.default
});