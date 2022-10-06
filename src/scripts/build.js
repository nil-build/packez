import webpack from "webpack";

import getWebpackConfig from "../config/webpack.prod";
import paths from "../config/paths";
import loadConfigFile from "../utils/loadConfigFile";

export function build(entry = paths.root + "/index", outDir = paths.dist, options = {}) {
  process.env.NODE_ENV = "development";

  const webpackConfig = getWebpackConfig({
    ...options,
    entry,
    output: {
      path: outDir,
    },
  });

  loadConfigFile(webpackConfig, options);

  const compiler = webpack(webpackConfig);
  compiler.run();
}
