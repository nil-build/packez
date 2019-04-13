
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _webpack = _interopRequireDefault(require("webpack"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _opn = _interopRequireDefault(require("opn"));

var _initConfig = _interopRequireDefault(require("../initConfig"));

var _checkDeps = _interopRequireDefault(require("../checkDeps"));

var _webpack2 = _interopRequireDefault(require("../webpack/webpack.config"));

var _printCompileMessages = _interopRequireDefault(require("../utils/printCompileMessages"));

var _logger = _interopRequireDefault(require("../utils/logger"));

function _default(entry, output, opts = {}) {
  const config = (0, _initConfig.default)(entry, output, opts); //安装依赖

  (0, _checkDeps.default)(config);
  config.assest.css.name = "[name].css";
  config.assest.css.chunkName = "[name].chunk.css";
  config.assest.js.name = "[name].js";
  config.assest.js.chunkName = "[name].chunk.js";
  config.assest.media.name = "[name].[ext]"; // config.pluginExtra.push(new webpack.HotModuleReplacementPlugin());
  // config.pluginExtra.push(new webpack.NoEmitOnErrorsPlugin());

  const devServerOptions = config.devServer || {};
  devServerOptions.contentBase = _path.default.resolve(config.cwd, config.outputDir);
  let webpackConfig = (0, _webpack2.default)(config); //自定义

  if (_lodash.default.isFunction(config.getWebpackConfig)) {
    webpackConfig = config.getWebpackConfig(webpackConfig);
  }

  _fsExtra.default.ensureDirSync(webpackConfig.output.path);

  if (config.clear) {
    _fsExtra.default.emptyDirSync(webpackConfig.output.path);
  }

  const url = `${devServerOptions.https ? 'https' : 'http'}://127.0.0.1:${devServerOptions.port}`;
  let compiler;

  try {
    compiler = (0, _webpack.default)(webpackConfig);
  } catch (err) {
    (0, _logger.default)(_chalk.default.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  compiler.hooks.invalid.tap('invalid', () => {
    (0, _logger.default)('Compiling...');
  });
  compiler.hooks.done.tap('done', async stats => {
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    });
    (0, _printCompileMessages.default)(stats, webpackConfig);

    if (!statsData.errors.length) {
      console.log(`  address: ${_chalk.default.underline(url)}`);
      console.log();
    }
  }); //https://webpack.js.org/guides/hot-module-replacement/

  _webpackDevServer.default.addDevServerEntrypoints(webpackConfig, devServerOptions);

  const server = new _webpackDevServer.default(compiler, devServerOptions);
  server.listen(devServerOptions.port, devServerOptions.host, () => {
    (0, _logger.default)(_chalk.default.cyan('Starting the development server...'));
    (0, _opn.default)(url);
  });
}