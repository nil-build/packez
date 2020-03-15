import _ from "lodash";
import {
	getTSCompilerOptions,
	getTSConfigFilePath,
} from "../config/getTSConfig";
import getBabelConfig from "../config/getBabelConfig";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const getCSSModuleLocalIdent = require("../utils/getCSSModuleLocalIdent");
const getPostCSSConfig = require("../config/postcss.config");

export default function(opts) {
	const inlineStyle = opts.inlineStyle;
	const include = opts.include;
	const exclude = opts.exclude;
	const shouldUseSourceMap = opts.shouldUseSourceMap;
	const isEnvDevelopment = opts.mode === "development";
	const isEnvProduction = opts.mode === "production";
	const cssPublicPath = _.get(opts, "assets.css.publicPath", opts.publicPath);
	const mediaPublicPath = _.get(
		opts,
		"assets.media.publicPath",
		opts.publicPath
	);
	const assetsMedia = opts.assets.media;
	const preLoaderExtra = opts.preLoaders || [];
	const loaderExtra = opts.loaders || [];
	const cssRegex = /\.css$/;
	const cssModuleRegex = /\.module\.css$/;
	const sassRegex = /\.(scss|sass)$/;
	const sassModuleRegex = /\.module\.(scss|sass)$/;
	const lessRegex = /\.less$/;
	const lessModuleRegex = /\.module\.less$/;
	const babelOptions = _.get(opts, "babel", {});

	let includePaths = include ? include : undefined;

	// common function to get style loaders
	const getStyleLoaders = (cssOptions, preProcessor) => {
		const loaders = [
			inlineStyle
				? require.resolve("style-loader")
				: {
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: cssPublicPath },
				  },
			{
				loader: require.resolve("css-loader"),
				options: cssOptions,
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// package.json
				loader: require.resolve("postcss-loader"),
				options: getPostCSSConfig(opts),
			},
		].filter(Boolean);
		if (preProcessor) {
			loaders.push(
				{
					loader: require.resolve("resolve-url-loader"),
					options: {
						removeCR: true,
						sourceMap: isEnvProduction && shouldUseSourceMap,
					},
				},
				{
					loader: require.resolve(preProcessor),
					options: {
						sourceMap: true,
					},
				}
			);
		}
		return loaders;
	};

	return {
		strictExportPresence: true,
		rules: [
			// Disable require.ensure
			{ parser: { requireEnsure: false } },

			...preLoaderExtra.map(loader => {
				return {
					...loader,
					enforce: "pre",
				};
			}),

			// run the linter.
			{
				enforce: "pre",
				test: /\.(js|mjs|jsx)$/,
				include: includePaths,
				exclude: /node_modules/,
				loader: require.resolve("eslint-loader"),
				options: {
					...opts.eslint,
					baseConfig: require("../config/eslint.config.js"),
					eslintPath: require.resolve("eslint"),
				},
			},
			{
				enforce: "pre",
				test: /\.(ts|tsx)$/,
				include: includePaths,
				exclude: /node_modules/,
				loader: require.resolve("eslint-loader"),
				options: {
					...opts.eslint,
					parser: "@typescript-eslint/parser",
					baseConfig: require("../config/eslint.config.js"),
					eslintPath: require.resolve("eslint"),
				},
			},
			{
				oneOf: [
					//扩展模块
					...loaderExtra,
					{
						test: assetsMedia.regexp,
						use: [
							{
								loader: require.resolve("url-loader"),
								options: {
									limit: assetsMedia.limit,
									name: assetsMedia.name,
									outputPath: assetsMedia.output,
									publicPath: mediaPublicPath,
								},
							},
						],
					},
					{
						test: /\.(js|mjs|jsx|ts|tsx)$/,
						loader: require.resolve("babel-loader"),
						include: includePaths,
						exclude: exclude || /node_modules/,
						options: {
							...getBabelConfig(babelOptions),
							cacheDirectory: true,
							cacheCompression: false,
							compact: isEnvProduction,
						},
					},
					// {
					// 	test: /\.tsx?$/,
					// 	include: includePaths,
					// 	exclude: /node_modules/,
					// 	use: [
					// 		{
					// 			loader: require.resolve("babel-loader"),
					// 			options: {
					// 				...getBabelConfig(babelOptions),
					// 				cacheDirectory: true,
					// 				cacheCompression: isEnvProduction,
					// 				compact: isEnvProduction,
					// 			},
					// 		},
					// 		{
					// 			loader: require.resolve("ts-loader"),
					// 			options: {
					// 				//编译时不做类型检查
					// 				transpileOnly: true,
					// 				configFile: getTSConfigFilePath(opts),
					// 				compilerOptions: getTSCompilerOptions(opts),
					// 			},
					// 		},
					// 	],
					// },
					{
						test: cssRegex,
						exclude: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: isEnvProduction && shouldUseSourceMap,
						}),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// using the extension .module.css
					{
						test: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: isEnvProduction && shouldUseSourceMap,
							modules: {
								getLocalIdent: getCSSModuleLocalIdent,
							},
						}),
					},
					{
						test: sassRegex,
						exclude: sassModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 3,
								sourceMap:
									isEnvProduction && shouldUseSourceMap,
							},
							"sass-loader"
						),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// using the extension .module.scss or .module.sass
					{
						test: sassModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 3,
								sourceMap:
									isEnvProduction && shouldUseSourceMap,
								modules: {
									getLocalIdent: getCSSModuleLocalIdent,
								},
							},
							"sass-loader"
						),
					},
					{
						test: lessRegex,
						exclude: lessModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 2,
								sourceMap:
									isEnvProduction && shouldUseSourceMap,
							},
							"less-loader"
						),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					// using the extension .module.less or .module.less
					{
						test: lessModuleRegex,
						use: getStyleLoaders(
							{
								importLoaders: 2,
								sourceMap:
									isEnvProduction && shouldUseSourceMap,
								modules: {
									getLocalIdent: getCSSModuleLocalIdent,
								},
							},
							"less-loader"
						),
					},
					//不匹配的情况下统一使用file-loader
					{
						loader: require.resolve("file-loader"),
						// Exclude `js` files to keep "css" loader working as it injects
						// its runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [
							/\.(js|mjs|jsx|ts|tsx)$/,
							/\.html$/,
							/\.json$/,
						],
						options: {
							name: assetsMedia.name,
							outputPath: assetsMedia.output,
							publicPath: mediaPublicPath,
						},
					},
				],
			},
		].filter(Boolean),
	};
}
