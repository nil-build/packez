
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _formatWebpackMessages = _interopRequireDefault(require("./formatWebpackMessages"));

var _printFileSizesAfterBuild = _interopRequireDefault(require("./printFileSizesAfterBuild"));

var _printBuildError = _interopRequireDefault(require("./printBuildError"));

var _logger = _interopRequireDefault(require("./logger"));

var _lodash = _interopRequireDefault(require("lodash"));

const printError = err => {
  (0, _logger.default)(_chalk.default.red('Failed to compile.\n'));
  (0, _printBuildError.default)(err);
};

var _default = (stats, config) => {
  let messages = (0, _formatWebpackMessages.default)(stats.toJson({
    all: false,
    warnings: true,
    errors: true
  }));

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }

    printError(new Error(messages.errors.join('\n\n')));
    return;
  }

  const warnings = messages.warnings;

  if (warnings.length) {
    (0, _logger.default)(_chalk.default.yellow('Compiled with warnings.\n'));
    console.log(warnings.join('\n\n'));
    console.log('\nSearch for the ' + _chalk.default.underline(_chalk.default.yellow('keywords')) + ' to learn more about each warning.');
    console.log('To ignore, add ' + _chalk.default.cyan('// eslint-disable-next-line') + ' to the line before.\n');
  }

  (0, _logger.default)(_chalk.default.green('Compiled successfully.\n'));
  (0, _printFileSizesAfterBuild.default)(stats, config);
};

exports.default = _default;