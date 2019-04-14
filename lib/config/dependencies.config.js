
"use strict";

module.exports = {
  "babel": ["babel-loader", "babel-preset-packez"],
  "css": ["style-loader", "css-loader", "postcss-loader", "mini-css-extract-plugin", "postcss-flexbugs-fixes", "postcss-preset-env"],
  "less": ["less", "less-loader"],
  "sass": ["node-sass", "sass-loader"],
  "scss": ["node-sass", "sass-loader"],
  "eslint": ["eslint", "babel-eslint", "eslint-loader", "eslint-config-packez"],
  "json5": ["json5-loader"],
  "vue": ["vue-loader", "vue-template-compiler"]
};