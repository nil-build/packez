import _ from "lodash";
import path from "path";
import fs from "fs-extra";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {
	getTSCompilerOptions,
	getTSConfigFilePath,
} from "../config/getTSConfig";
const typescriptFormatter = require("../utils/typescriptFormatter");

//
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//var Visualizer = require('webpack-visualizer-plugin');

export default function(opts) {
	const isEnvProduction = opts.mode === "production";
	const isEnvDevelopment = opts.mode === "development";
	const corePlugins = opts.plugins;
	const manifest = opts.manifest;
	const tsCheck = opts.tsCheck;
	const plugins = [
		...opts.pluginExtra,
		new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/locale$/,
			contextRegExp: /moment$/,
		}),
	].filter(Boolean);

	//打包合并css成文件
	if (!opts.inlineStyle) {
		const MiniCssExtractPlugin = require("mini-css-extract-plugin");
		plugins.push(
			new MiniCssExtractPlugin({
				filename: [
					opts.assest.css.output || ".",
					opts.assest.css.name,
				].join("/"),
				chunkFilename: [
					opts.assest.css.output || ".",
					opts.assest.css.chunkName,
				].join("/"),
			})
		);
	}

	if (manifest) {
		plugins.push(
			new ManifestPlugin({
				fileName: "asset-manifest.json",
				publicPath: opts.publicPath,
			})
		);
	}

	//生成html页面
	if (opts.shouldUseEntryHTML) {
		const defaultHtmlOpts = {
			inject: true,
			templateParameters: {
				PUBLIC_URL: [opts.publicPath || "."].join("/"), //, path.relative(opts.outputDir,1)
			},
		};
		if (isEnvProduction) {
			defaultHtmlOpts.minify = {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			};
		}
		// 示例
		// entry: {
		//     app1: './src/index.js',
		//     app2: './src/app.js',
		// }
		// 如果不指定html模板则默认寻找 ./src/index.html 和 ./src/app.html 文件

		Object.keys(opts.entry).forEach(key => {
			var htmlOpts = Object.assign({}, defaultHtmlOpts);
			const len = opts.entry[key].length;
			const entry = opts.entry[key][len - 1];
			let template =
				opts.entryHTMLTemplates[key] ||
				entry.replace(/\.(?:js|mjs|jsx|ts|tsx)$/, ".html");

			template = path.resolve(opts.cwd, template);
			if (fs.existsSync(template)) {
				htmlOpts.template = template;
			} else {
				htmlOpts.template = path.resolve(
					__dirname,
					"../public/index.html"
				);
			}

			htmlOpts.filename = key + ".html";
			htmlOpts.chunks = [key];

			plugins.push(new HtmlWebpackPlugin(htmlOpts));
		});
	}

	if (tsCheck) {
		plugins.push(
			new ForkTsCheckerWebpackPlugin({
				tsconfig: getTSConfigFilePath(opts),
				compilerOptions: getTSCompilerOptions(opts),
				async: isEnvDevelopment,
				useTypescriptIncrementalApi: true,
				checkSyntacticErrors: true,
				formatter: typescriptFormatter,
			})
		);
	}

	return plugins;
}
