"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _start = _interopRequireDefault(require("./start"));

function _default(entry, output, opts = {}) {
  (0, _start.default)(entry, output, Object.assign({
    watch: false
  }, opts, {
    mode: "production"
  }));
}