
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printFileSizesAfterBuild;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _filesize = _interopRequireDefault(require("filesize"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

var _chalk = _interopRequireDefault(require("chalk"));

var _gzipSize = _interopRequireDefault(require("gzip-size"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function printFileSizesAfterBuild(stats, config) {
  const root = config.output.path;
  const isEnvProduction = config.mode === 'production';
  const assets = stats.toJson({
    all: false,
    assets: true
  }).assets.filter(assest => /\.(?:css|js|html?)$/.test(assest.name)).map(asset => {
    let sizeLabel = (0, _filesize.default)(asset.size);

    if (isEnvProduction) {
      const fileContents = _fsExtra.default.readFileSync(_path.default.join(root, asset.name));

      const gsize = _chalk.default.green((0, _filesize.default)(_gzipSize.default.sync(fileContents)));

      sizeLabel += `(${gsize})`;
    }

    return _objectSpread({}, asset, {
      sizeLabel
    });
  });
  assets.sort((a, b) => b.size - a.size);
  var longestSizeLabelLength = Math.max.apply(null, assets.map(a => (0, _stripAnsi.default)(a.sizeLabel).length));
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel;
    let sizeLength = (0, _stripAnsi.default)(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      let rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }

    console.log('  ' + sizeLabel + '  ' + //chalk.dim(asset.folder + path.sep) +
    _chalk.default.cyan(asset.name));
  });
  console.log();
}