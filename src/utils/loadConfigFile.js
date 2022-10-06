import fs from "fs-extra";
import paths from "../config/paths";
import path from "path";

export default function loadConfigFile(webpackConfig, options = {}) {
  const configFile = path.resolve(paths.root, options.configFile || "./packez.config.js");

  if (fs.existsSync(configFile)) {
    const fn = require(configFile);
    if (isFunction(fn)) {
      webpackConfig = fn(webpackConfig);
    }
  }

  return webpackConfig;
}
