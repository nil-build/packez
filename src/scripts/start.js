import _ from "lodash";
import fs from "fs-extra";
import chalk from "chalk";
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import webpackConfigFactory from "../webpack/webpack.config";
import createWebpackCompiler from "../utils/createWebpackCompiler";
import printBuildError from "../utils/printBuildError";
import log from "../utils/logger";

export default function(entry, output, opts = {}) {
	if (opts.mode !== "production") {
		opts = _.defaultsDeep({}, opts, {
			assets: {
				css: {
					name: "[name].css",
					chunkName: "[name].chunk.css",
				},
				js: {
					name: "[name].js",
					chunkName: "[name].chunk.js",
				},
				media: {
					name: "[name].[ext]",
				},
			},
			watch: true,
		});
	}

	const config = initConfig(entry, output, opts);

	fs.ensureDirSync(config.outputDir);

	if (config.clean) {
		fs.emptyDirSync(config.outputDir);
	}

	const watch = config.watch;
	const watchOptions = config.watchOptions;

	const compiler = createWebpackCompiler(config);

	const printError = err => {
		log(chalk.red("Failed to compile.\n"));
		printBuildError(err);
	};

	const cb = err => {
		if (err) {
			if (!err.message) {
				printError(err);
			} else {
				printError(new Error(err.message));
			}
		}
	};

	if (watch) {
		compiler.watch(watchOptions, cb);
	} else {
		compiler.run(cb);
	}
}
