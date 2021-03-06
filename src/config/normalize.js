import { defaultsDeep, isFunction, isString, get } from "lodash";
import path from "path";
import fs from "fs-extra";
import hasTSConfig from "../utils/hasTSConfig";

export default (opts) => {
	const defaultOptions = {
		cwd: process.cwd(),
		mode: "development", // development production
		include: null,
		exclude: null,
		//outputDir: 'dist',
		publicPath: "",

		configFile: "./packez.config.js",

		useTypeScript: get(opts, "useTypeScript", hasTSConfig()),

		polyfills: require.resolve("../polyfills"),

		manifest: true,

		shouldUseEntryHTML: true,
		//默认根据entry自动获取对于的.html文件
		entryHTMLTemplates: {},

		shouldUseSourceMap: false,

		inlineStyle: false,

		clean: true,

		babel: {},

		eslint: {},

		less: {},

		sass: {},

		postcss: [],

		//webpack加载器
		loaders: [],
		//webpack预处理加载器
		preLoaders: [],

		//webpack扩展插件
		plugins: [],

		assets: {
			css: {
				name: "[name].[contenthash:8].css",
				chunkName: "[name].[chunkhash:8].chunk.css",
				output: "static/css",
			},
			js: {
				name: "[name].[chunkhash:8].js",
				chunkName: "[name].[chunkhash:8].chunk.js",
				output: "static/js",
			},
			media: {
				regexp: /\.(?:png|jpe?g|gif|bmp)$/,
				name: "[name].[hash:8].[ext]",
				output: "static/media",
				limit: 10000,
			},
			raw: {
				regexp: /\.(?:svg|txt)$/,
				esModule: true,
				options: {},
			},
		},
		//打包时如果检查到package.json未设置browserslist时则将该配置写到package.json中
		//后续如果需要修改browserslist则直接修改package.json文件
		browserslist: [
			">=0.25%",
			"not dead",
			"not op_mini all",
			"not Android 4.4.3-4.4.4",
			"not ios_saf < 10",
			// "not ie <= 11",
			"not Chrome < 50", // caniuse lastest is reporting chrome 29
			"firefox ESR",
		],

		//webpack options
		devtool: null,
		optimization: {},
		target: "web",
		resolve: {},
		externals: {},
		performance: false,

		//watch
		watch: false,
		watchOptions: {
			aggregateTimeout: 300,
			poll: undefined,
		},
		//devServer
		devServer: {
			host: "0.0.0.0",
			clientLogLevel: "none",
			quiet: true,
			watchContentBase: true,
			hot: false,
			overlay: false,
			compress: true,
			port: 9000,
			publicPath: "/",
		},
		node: {
			module: "empty",
			dgram: "empty",
			dns: "mock",
			fs: "empty",
			net: "empty",
			tls: "empty",
			child_process: "empty",
		},
	};

	const _opts = defaultsDeep({}, opts, defaultOptions);

	let configFile = isString(_opts.configFile)
		? path.resolve(_opts.cwd, _opts.configFile)
		: _opts.configFile;
	let config = {};

	if (configFile !== false && fs.existsSync(configFile)) {
		config = require(configFile);
		if (isFunction(config)) {
			config = config(_opts, opts.state);
			//hook
			if (config && !config.assets && config.assest) {
				config.assets = config.assest;
			}
		}
	}

	return defaultsDeep(config, _opts);
};
