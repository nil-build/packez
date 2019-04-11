
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "getWebpackConfig", {
  enumerable: true,
  get: function () {
    return _webpack.default;
  }
});

_Object$defineProperty(exports, "checkDeps", {
  enumerable: true,
  get: function () {
    return _checkDeps.default;
  }
});

_Object$defineProperty(exports, "initConfig", {
  enumerable: true,
  get: function () {
    return _initConfig.default;
  }
});

_Object$defineProperty(exports, "start", {
  enumerable: true,
  get: function () {
    return _start.default;
  }
});

var _webpack = _interopRequireDefault(require("./webpack/webpack.config"));

var _checkDeps = _interopRequireDefault(require("./checkDeps"));

var _initConfig = _interopRequireDefault(require("./initConfig"));

var _start = _interopRequireDefault(require("./scripts/start"));