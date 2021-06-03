const packez = require("../lib");
const path = require("path");

const dist = __dirname + "/dist-start";
packez.start(
  {
    index: [
      require.resolve("./src/boot.js"),
      require.resolve("./src/index.js"),
    ],
    app: require.resolve("./src/news.js"),
  },
  dist,
  {
    useTypeScript: false,
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  }
);
