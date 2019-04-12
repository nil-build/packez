
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = printFileSizesAfterBuild;

var _filesize = _interopRequireDefault(require("filesize"));

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

const chalk = require('chalk');

function printFileSizesAfterBuild(stats) {
  const assets = stats.toJson({
    all: false,
    assets: true
  }).assets.filter(assest => /\.(?:css|js)$/.test(assest.name)).map(asset => {
    return { ...asset,
      sizeLabel: (0, _filesize.default)(asset.size)
    };
  });
  assets.sort((a, b) => b.size - a.size);
  var longestSizeLabelLength = Math.max.apply(null, assets.map(a => (0, _stripAnsi.default)(a.sizeLabel).length));
  assets.forEach(asset => {
    var sizeLabel = asset.sizeLabel;
    var sizeLength = (0, _stripAnsi.default)(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }

    console.log('  ' + sizeLabel + '  ' + //chalk.dim(asset.folder + path.sep) +
    chalk.cyan(asset.name));
  });
  console.log();
}