import path from "path";
import _ from "lodash";
import getWebpackModules from "./getWebpackModules";
import getWebpackPlugins from "./getWebpackPlugins";
import getWebpackOptimization from "./getWebpackOptimization";
// import PnpWebpackPlugin from "pnp-webpack-plugin";

export default function(opts) {
	const assetsJs = opts.assets.js;
	const shouldUseSourceMap = opts.shouldUseSourceMap;
	const isEnvProduction = opts.mode === "production";
	const isEnvDevelopment = opts.mode === "development";

	return {
		context: opts.cwd,
		mode: isEnvProduction
			? "production"
			: isEnvDevelopment && "development",
		bail: isEnvProduction,
		devtool:
			opts.devtool ||
			(isEnvProduction
				? shouldUseSourceMap
					? "source-map"
					: false
				: isEnvDevelopment && "cheap-module-source-map"),
		entry: opts.entry,
		output: _.defaultsDeep(opts.output || {}, {
			path: path.resolve(opts.cwd, opts.outputDir),
			filename: [assetsJs.output || ".", assetsJs.name].join("/"),
			chunkFilename: [assetsJs.output || ".", assetsJs.chunkName].join(
				"/"
			),
			publicPath: opts.publicPath,
		}),

		module: getWebpackModules(opts),
		plugins: getWebpackPlugins(opts),
		optimization: getWebpackOptimization(opts),
		externals: opts.externals,
		resolve: {
			extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"],
			// plugins: [PnpWebpackPlugin],
			...opts.resolve,
		},
		// resolveLoader: {
		// 	plugins: [PnpWebpackPlugin.moduleLoader(module)],
		// },
		target: opts.target,
		// Some libraries import Node modules but don't use them in the browser.
		// Tell webpack to provide empty mocks for them so importing them works.
		node: {
			module: "empty",
			dgram: "empty",
			dns: "mock",
			fs: "empty",
			http2: "empty",
			net: "empty",
			tls: "empty",
			child_process: "empty",
		},
		// Turn off performance processing because we utilize
		// our own hints via the FileSizeReporter
		// performance: opts.performance,
		performance: false,
	};
}
