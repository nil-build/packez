const { bundle } = require("../lib/scripts/bundle");
const path = require("path");

const dist = __dirname + "/dist-bundle";
bundle(
  {
    app: require.resolve("./src/news.js"),
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
