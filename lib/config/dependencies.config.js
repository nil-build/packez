
"use strict";

module.exports = {
  "babel": ["babel-loader", "babel-preset-packez"],
  "css": ["style-loader", "css-loader", "postcss-loader", "mini-css-extract-plugin", // "precss",
  "postcss-flexbugs-fixes", //"autoprefixer",
  "postcss-preset-env"],
  "less": ["less", "less-loader"],
  "sass": ["node-sass", "sass-loader"],
  "eslint": ["eslint", "babel-eslint", "eslint-config-react-app"],
  "json5": ["json5-loader"],
  "vue": ["vue-loader", "vue-template-compiler"]
};