import program from "commander";

import pkg from "../package.json";
import * as packez from "./index";
import path from "path";
import paths from "./config/paths";

program
  .version(pkg.version)
  // .option("-w, --watch", "是否监控文件改变")
  .option("-d, --outDir [outDir]", "输出到指定目录，默认为 dist", "dist")
  // .option("-t, --target [target]", "转换目标格式：web | node 默认为 web", /^node|web$/, "web")
  // .option("-c, --clean", "转换前清空输出目录")
  // .option("-p, --publicPath [publicPath]", "publicPath", "")
  .option("--config [config]", "configFile", "./packez.config.js")
  // .option("--state [state]", "state", "")
  .parse(process.argv);

const options = program.opts();

const validExecutors = ["build", "server"];
const args = program.args;
const outputDir = options.outDir || "dist";
let entry = "./src/index";
let executor = "server";

if (args.length === 1) {
  entry = args[0];
} else if (args.length > 1) {
  executor = args[0];
  entry = args[1];
}

if (validExecutors.indexOf(executor) === -1) {
  throw new Error(`packez method ${executor} not exists! you may use build,server`);
}

packez[executor](path.resolve(paths.root, entry), path.resolve(paths.root, outputDir), {
  configFile: options.config,
});
