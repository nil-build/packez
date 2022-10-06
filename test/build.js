const { build } = require("../lib/scripts/build");
const path = require("path");

const dist = __dirname + "/dist-build";
build(
  {
    index: [
      require.resolve("./src/boot.js"),
      require.resolve("./src/index.js"),
    ],
    // app: require.resolve("./src/news.js"),
  },
  dist,
  {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  }
);
