import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";

import getWebpackConfig from "../config/webpack.dev";
import paths from "../config/paths";

import loadConfigFile from "../utils/loadConfigFile";

export function server(entry = paths.root + "/index", outDir = paths.dist, options = {}) {
  process.env.NODE_ENV = "development";

  const webpackConfig = getWebpackConfig({
    ...options,
    // entry 路径必须绝对地址
    entry: entry,
    output: {
      path: outDir,
    },
  });

  loadConfigFile(webpackConfig, options);

  const devServerOptions = webpackConfig.devServer || {};

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  server.startCallback(() => {
    // console.log("Successfully started server on " + url);
  });
}
