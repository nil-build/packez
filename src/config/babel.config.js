const { isDevEnv } = require("../utils");

module.exports = function () {
  const plugins = [];

  if (isDevEnv()) {
    plugins.push(require.resolve("react-refresh/babel"));
  }

  return {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          modules: false,
        },
      ],
      [
        require.resolve("@babel/preset-react"),
        {
          runtime: "automatic",
        },
      ],
      [
        require.resolve("@babel/preset-typescript"),
        {
          allowDeclareFields: true,
        },
      ],
    ],

    plugins: [
      ...plugins,
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: true,
        },
      ],
    ],
  };
};
