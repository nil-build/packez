
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = printFileSizesAfterBuild;

var _filesize = _interopRequireDefault(require("filesize"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

var _chalk = _interopRequireDefault(require("chalk"));

var _gzipSize = _interopRequireDefault(require("gzip-size"));

function printFileSizesAfterBuild(stats, config) {
  const root = config.output.path;
  const assets = stats.toJson({
    all: false,
    assets: true
  }).assets.filter(assest => /\.(?:css|js|html?)$/.test(assest.name)).map(asset => {
    const fileContents = _fsExtra.default.readFileSync(_path.default.join(root, asset.name));

    const gsize = _chalk.default.green((0, _filesize.default)(_gzipSize.default.sync(fileContents)));

    return { ...asset,
      gsizeLabel: 'gzip:' + gsize,
      sizeLabel: (0, _filesize.default)(asset.size) + `(${gsize})`
    };
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