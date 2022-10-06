import getWebpackConfig from "../config/webpack.dev";
import webpack from "webpack";
import paths from "../config/paths";

export function bundle(entry = paths.root + "/index", outDir = paths.dist, options = {}) {
  const webpackConfig = getWebpackConfig({
    ...options,
    entry,
    output: {
      globalObject: "this",
      libraryTarget: "umd",
      path: outDir,
    },
  });

  webpackConfig.optimization = {
    runtimeChunk: false,
    splitChunks: false,
  };

  const compiler = webpack(webpackConfig);
  compiler.run();
}
