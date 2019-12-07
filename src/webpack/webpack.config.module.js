import _ from "lodash";
import path from "path";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("../utils/getCSSModuleLocalIdent");
const getPostCSSConfig = require("../config/postcss.config");

function getBabelConfig(options) {
    const plugins = options.plugins || [];
    const presets = options.presets || [];

    return {
        babelrc: _.get(options, "babelrc", true),
        configFile: _.get(options, "configFile", true),
        compact: _.get(options, "compact", false),
        presets: [
            [
                require.resolve("babel-preset-packez"),
                _.defaultsDeep(
                    {},
                    _.omit(options, [
                        "presets",
                        "plugins",
                        "babelrc",
                        "configFile",
                        "compact"
                    ]),
                    {
                        loose: true,
                        modules: false,
                        strictMode: true,
                        decoratorsBeforeExport: true
                    }
                )
            ],
            ...presets
        ],
        plugins: [...plugins]
    };
}

module.exports = function(opts) {
    const inlineStyle = opts.inlineStyle;
    const shouldUseSourceMap = opts.shouldUseSourceMap;
    const isEnvDevelopment = opts.mode === "development";
    const isEnvProduction = opts.mode === "production";
    const cssPublicPath = _.get(opts, "assest.css.publicPath", opts.publicPath);
    const mediaPublicPath = _.get(
        opts,
        "assest.media.publicPath",
        opts.publicPath
    );
    const assestMedia = opts.assest.media;
    const loaders = opts.loaders || {};
    const preLoaderExtra = opts.preLoaderExtra || [];
    const loaderExtra = opts.loaderExtra || [];
    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;
    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;
    const babelOptions = _.get(opts, "babel", {});
    const exclude = babelOptions.exclude;
    delete babelOptions.exclude;

    const appSrc = Array.isArray(opts.appSrc) ? opts.appSrc : [opts.appSrc];
    let includePaths = [
        ...appSrc
            .filter(Boolean)
            .map(appPath => path.resolve(opts.cwd, appPath))
    ];

    includePaths = includePaths.length ? includePaths : undefined;

    // common function to get style loaders
    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            inlineStyle
                ? require.resolve("style-loader")
                : {
                      loader: MiniCssExtractPlugin.loader,
                      options: { publicPath: cssPublicPath }
                  },
            {
                loader: require.resolve("css-loader"),
                options: cssOptions
            },
            {
                // Options for PostCSS as we reference these options twice
                // Adds vendor prefixing based on your specified browser support in
                // package.json
                loader: require.resolve("postcss-loader"),
                options: getPostCSSConfig(opts)
            }
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve("resolve-url-loader"),
                    options: {
                        sourceMap: isEnvProduction && shouldUseSourceMap
                    }
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: true
                    }
                }
            );
        }
        return loaders;
    };

    return {
        rules: [
            // Disable require.ensure
            { parser: { requireEnsure: false } },

            ...preLoaderExtra.map(loader => {
                return {
                    ...loader,
                    enforce: "pre"
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
                    ...loaders.eslint,
                    baseConfig: require("../config/eslint.config.js"),
                    eslintPath: require.resolve("eslint")
                }
            },
            {
                oneOf: [
                    //扩展模块
                    ...loaderExtra,
                    {
                        test: assestMedia.regexp,
                        use: [
                            {
                                loader: require.resolve("url-loader"),
                                options: {
                                    limit: assestMedia.limit,
                                    name: assestMedia.name,
                                    outputPath: assestMedia.output,
                                    publicPath: mediaPublicPath
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(js|mjs|jsx)$/,
                        loader: require.resolve("babel-loader"),
                        include: includePaths,
                        exclude: exclude || /node_modules/,
                        options: {
                            ...getBabelConfig(babelOptions),
                            cacheDirectory: true,
                            cacheCompression: isEnvProduction,
                            compact: isEnvProduction
                        }
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: require.resolve("babel-loader"),
                                options: {
                                    ...getBabelConfig(babelOptions),
                                    cacheDirectory: true,
                                    cacheCompression: isEnvProduction,
                                    compact: isEnvProduction
                                }
                            },
                            {
                                loader: require.resolve("ts-loader"),
                                options: {
                                    transpileOnly: true
                                    // configFile: getTSCommonConfig.getConfigFilePath(),
                                    // compilerOptions: tsConfig
                                }
                            }
                        ]
                    },
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: isEnvProduction && shouldUseSourceMap
                        }),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true
                    },
                    // using the extension .module.css
                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap: isEnvProduction && shouldUseSourceMap,
                            modules: true,
                            getLocalIdent: getCSSModuleLocalIdent
                        })
                    },
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: isEnvProduction && shouldUseSourceMap
                            },
                            "sass-loader"
                        ),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true
                    },
                    // using the extension .module.scss or .module.sass
                    {
                        test: sassModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap:
                                    isEnvProduction && shouldUseSourceMap,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent
                            },
                            "sass-loader"
                        )
                    },
                    {
                        test: lessRegex,
                        exclude: lessModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap: isEnvProduction && shouldUseSourceMap
                            },
                            "less-loader"
                        ),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true
                    },
                    // using the extension .module.less or .module.less
                    {
                        test: lessModuleRegex,
                        use: getStyleLoaders(
                            {
                                importLoaders: 2,
                                sourceMap:
                                    isEnvProduction && shouldUseSourceMap,
                                modules: true,
                                getLocalIdent: getCSSModuleLocalIdent
                            },
                            "less-loader"
                        )
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
                            /\.json$/
                        ],
                        options: {
                            name: assestMedia.name,
                            outputPath: assestMedia.output,
                            publicPath: mediaPublicPath
                        }
                    }
                ]
            }
        ].filter(Boolean)
    };
};
