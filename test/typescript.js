const packez = require("../lib");
const path = require("path");

const dist = __dirname + "/dist-typescript";
packez.start(
  {
    app: require.resolve("./src/index.ts"),
  },
  dist,
  {
    useTypeScript: true,
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  }
);
