const path = require("path");

const root = process.cwd();

module.exports = {
  root,
  src: path.resolve(root, "./src"),
  build: path.resolve(root, "./dist"),
  buildTest: path.resolve(root, "./dist-test"),
  public: path.resolve(root, "./public"),
};
