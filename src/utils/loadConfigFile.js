import fs from "fs-extra";
import paths from "../config/paths";
import path from "path";
import { isFunction } from "lodash";

export default function loadConfigFile(webpackConfig, options = {}) {
  const configFile = path.resolve(paths.root, options.configFile || "./packez.config.js");

  if (fs.existsSync(configFile)) {
    let config = require(configFile);
    if (isFunction(fn)) {
      config = fn();
    }

    if (config.webpack) {
      webpackConfig = config.webpack(webpackConfig) || webpackConfig;
    }
  }

  return webpackConfig;
}
