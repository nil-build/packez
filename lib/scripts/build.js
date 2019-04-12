
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _start = _interopRequireDefault(require("./start"));

function _default(entry, output, opts = {}) {
  (0, _start.default)(entry, output, { ...opts,
    mode: "production",
    watch: false
  });
}