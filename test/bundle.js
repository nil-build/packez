const packez = require("../lib");
const path = require("path");

const dist = __dirname + "/dist-bundle";
packez.bundle(
  {
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
