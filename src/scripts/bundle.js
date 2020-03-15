import _ from "lodash";
import fs from "fs-extra";
import initConfig from "../initConfig";
import start from "./start";
import checkDeps from "../checkDeps";
import getWebpackConfig from "../webpack/webpack.config";
import createWebpackCompiler from "../utils/createWebpackCompiler";

export default function(entry, output, opts = {}) {
	opts.shouldUseEntryHTML = false;
	opts.polyfills = null;
	opts.devtool = null;
	opts.manifest = false;
	opts.optimization = {
		runtimeChunk: false,
		splitChunks: false,
	};
	opts.babel = {
		corejs: false,
		useBuiltIns: false,
		modules: false,
		...opts.babel,
	};
	opts.output = {
		globalObject: "this",
		libraryTarget: "umd",
		// library: "MyApp"
		...opts.output,
	};

	opts.assets = _.defaultsDeep(opts.assets, {
		js: {
			name: "[name].js",
			output: "",
		},
		css: {
			name: "[name].css",
			output: "css",
		},
		media: {
			name: "[name].[ext]",
			output: "media",
		},
	});

	start(entry, output, opts);

	// const config = initConfig(entry, output, opts);

	// let webpackConfig = getWebpackConfig(config);

	// fs.ensureDirSync(webpackConfig.output.path);

	// if (config.clean) {
	// 	fs.emptyDirSync(webpackConfig.output.path);
	// }

	// const watch = config.watch;
	// const watchOptions = config.watchOptions;

	// run(
	// 	Object.assign(webpackConfig, {
	// 		watch,
	// 		watchOptions,
	// 	}),
	// 	config
	// );
}
