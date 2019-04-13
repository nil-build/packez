
"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

function _default(msg, ...rest) {
  const date = new Date().toLocaleString();
  console.log('[' + date + '] - ' + msg, ...rest);
}