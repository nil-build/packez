import _ from "lodash";
import webpack from "webpack";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import webpackDevServer from "webpack-dev-server";
import opn from "opn";
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import printCompileMessages from "../utils/printCompileMessages";

import webpackConfigFactory from "../webpack/webpack.config";
import createWebpackCompiler from "../utils/createWebpackCompiler";
import printBuildError from "../utils/printBuildError";

import log from "../utils/logger";

export default function(entry, output, opts = {}) {
	const config = initConfig(entry, output, opts);

	config.assest.css.name = "[name].css";
	config.assest.css.chunkName = "[name].chunk.css";
	config.assest.js.name = "[name].js";
	config.assest.js.chunkName = "[name].chunk.js";
	config.assest.media.name = "[name].[ext]";

	const devServerOptions = config.devServer || {};
	devServerOptions.contentBase = path.resolve(config.cwd, config.outputDir);

	// let webpackConfig = webpackConfigFactory(config);

	//自定义
	// if (_.isFunction(config.getWebpackConfig)) {
	// 	webpackConfig = config.getWebpackConfig(webpackConfig);
	// }

	fs.ensureDirSync(config.outputDir);

	if (config.clean) {
		fs.emptyDirSync(config.outputDir);
	}

	const url = `${devServerOptions.https ? "https" : "http"}://127.0.0.1:${
		devServerOptions.port
	}`;

	const compiler = createWebpackCompiler(config);

	compiler.hooks.done.tap("done", async stats => {
		const statsData = stats.toJson({
			all: false,
			warnings: true,
			errors: true,
		});

		if (!statsData.errors.length) {
			console.log(`  address: ${chalk.underline(url)}`);
			console.log();
		}
	});
	//https://webpack.js.org/guides/hot-module-replacement/
	// webpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
	const server = new webpackDevServer(compiler, devServerOptions);

	server.listen(devServerOptions.port, devServerOptions.host, () => {
		log(chalk.cyan("Starting the development server..."));
		opn(url);
	});
}
