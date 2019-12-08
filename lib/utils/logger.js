"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(msg, ...rest) {
  const date = new Date().toLocaleString();
  console.log('[' + date + '] - ' + msg, ...rest);
}