const { server } = require("../lib/scripts/server");
const path = require("path");

const dist = __dirname + "/dist-server";
server(
  {
    index: [
      require.resolve("./src/boot.js"),
      require.resolve("./src/index.js"),
    ],
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
