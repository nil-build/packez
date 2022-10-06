const postcssNormalize = require("postcss-normalize");

module.exports = function (opts) {
  return {
    plugins: [
      require("postcss-import"),
      require("autoprefixer"),
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env"),
      postcssNormalize(),
    ],
  };
};
