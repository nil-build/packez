
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

if (typeof window.Set === 'undefined') {
  window.Set = _set.default;
}

if (typeof window.Map === 'undefined') {
  window.Map = _map.default;
}

if (typeof window.Promise === 'undefined') {
  window.Promise = _promise.default;
}

require('whatwg-fetch');

require('raf').polyfill(window);