
"use strict";

//const browserslist = require('./browserslist.config');
// const autoprefixer = require('autoprefixer');
module.exports = function (opts) {
  return {
    ident: "postcss",
    plugins: () => [require("postcss-flexbugs-fixes"), require("postcss-preset-env")({
      autoprefixer: {
        // browsers: opts.browsers || browserslist,
        flexbox: "no-2009"
      },
      stage: 3
    })]
  };
};