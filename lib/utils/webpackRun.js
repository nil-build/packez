
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _webpack = _interopRequireDefault(require("webpack"));

var _lodash = _interopRequireDefault(require("lodash"));

var _chalk = _interopRequireDefault(require("chalk"));

var _formatWebpackMessages = _interopRequireDefault(require("./formatWebpackMessages"));

var _printBuildError = _interopRequireDefault(require("./printBuildError"));

var _printFileSizesAfterBuild = _interopRequireDefault(require("./printFileSizesAfterBuild"));

var _printCompileMessages = _interopRequireDefault(require("./printCompileMessages"));

var _logger = _interopRequireDefault(require("./logger"));

function _default(config) {
  const watch = config.watch;
  const watchOptions = config.watchOptions;
  delete config.watch;
  delete config.watchOptions;
  (0, _logger.default)('Starting compile...\n');
  let compiler = (0, _webpack.default)(config);

  const printError = err => {
    (0, _logger.default)(_chalk.default.red('Failed to compile.\n'));
    (0, _printBuildError.default)(err);
  };

  const compilerCb = (err, stats) => {
    if (err) {
      if (!err.message) {
        printError(err);
      } else {
        printError(new Error(err.message));
      }

      return;
    }

    (0, _printCompileMessages.default)(stats, config); // let messages = formatWebpackMessages(
    //     stats.toJson({ all: false, warnings: true, errors: true })
    // );
    // if (messages.errors.length) {
    //     // Only keep the first error. Others are often indicative
    //     // of the same problem, but confuse the reader with noise.
    //     if (messages.errors.length > 1) {
    //         messages.errors.length = 1;
    //     }
    //     printError(new Error(messages.errors.join('\n\n')));
    //     return;
    // }
    // const warnings = messages.warnings;
    // if (warnings.length) {
    //     log(chalk.yellow('Compiled with warnings.\n'));
    //     console.log(warnings.join('\n\n'));
    //     console.log(
    //         '\nSearch for the ' +
    //         chalk.underline(chalk.yellow('keywords')) +
    //         ' to learn more about each warning.'
    //     );
    //     console.log(
    //         'To ignore, add ' +
    //         chalk.cyan('// eslint-disable-next-line') +
    //         ' to the line before.\n'
    //     );
    // } else {
    //     log(chalk.green('Compiled successfully.\n'));
    //     printFileSizesAfterBuild(stats, config)
    // }
  };

  if (watch) {
    compiler.watch(watchOptions, compilerCb);
  } else {
    compiler.run(compilerCb);
  }
}