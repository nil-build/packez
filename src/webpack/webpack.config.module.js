const path = require('path');
const fs = require("fs");
const babelConfig = require('../config/babel.config');
const postConfig = require('../config/postcss.config');

/**
 * 常用加载器
 */
function defaultLoaders(cfg) {
    const assestMedia = cfg.assest.media;

    const exclude = [
        /\.ejs$/,
        /\.jsx?$/,
        /\.css$/,
        /\.scss$/,
        /\.sass$/,
        /\.less$/,
        /\.json5?$/,
        /\.html?$/,
        cfg.rawLoaderRegexp,
        assestMedia.regexp,
    ];

    if (cfg.modules.vue) {
        exclude.push(/\.vue$/);
    }

    return [
        //自定义匹配规则
        {
            test: cfg.rawLoaderRegexp,
            loader: require.resolve("raw-loader"),
        },
        //html文件加载
        {
            test: /\.html?$/,
            loader: require.resolve("html-loader"),
            options: cfg.htmlLoaderOptions
        },
        //资源文件如图片
        {
            test: assestMedia.regexp,
            use: [{
                loader: require.resolve('url-loader'),
                options: {
                    limit: assestMedia.limit,
                    name: assestMedia.name,
                    outputPath: assestMedia.output,
                }
            }]
        },
        //其他文件
        {
            exclude,
            loader: require.resolve('file-loader'),
            options: {
                name: assestMedia.name,
                outputPath: assestMedia.output,
            }
        }
    ];
}

const loaders = {
    babel(cfg) {
        return {
            test: /\.m?jsx?$/,
            exclude: cfg.babelOptions.exclude,
            use: [{
                loader: require.resolve('babel-loader'),
                options: babelConfig(cfg)
            }]
        };
    },
    css(cfg) {
        return {
            test: /\.css$/,
            use: [
                cfg.inlineStyle
                    ? require.resolve("style-loader")
                    : require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: postConfig(cfg)
                }
            ]
        };
    },
    less(cfg) {
        return {
            test: /\.less$/,
            use: [
                cfg.inlineStyle
                    ? require.resolve("style-loader")
                    : require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: {
                        config: {
                            path: path.resolve(__dirname, '../config/postcss.config.js')
                        }
                    }
                },
                require.resolve("less-loader")
            ]
        };
    },
    scss(cfg) {
        return {
            test: /\.s(?:a|c)ss$/,
            use: [
                cfg.inlineStyle
                    ? require.resolve("style-loader")
                    : require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: {
                        config: {
                            path: path.resolve(__dirname, '../config/postcss.config.js')
                        }
                    }
                },
                require.resolve("sass-loader")
            ]
        };
    },
    sass(cfg) {
        return this.scss(cfg);
    },
    json5(cfg) {
        return {
            test: /\.json5$/,
            loader: require.resolve('json5-loader')
        };
    },
    vue(cfg) {
        return {
            test: /\.vue$/,
            loader: require.resolve("vue-loader"),
        }
    }
}


module.exports = function (opts) {
    // const rules = [];
    // const oneOf = [];
    // const enableModule = cfg.modules;

    const cssRegex = /\.css$/;
    const cssModuleRegex = /\.module\.css$/;
    const sassRegex = /\.(scss|sass)$/;
    const sassModuleRegex = /\.module\.(scss|sass)$/;
    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;

    const getStyleLoaders = function (cssOptions, preProcessor) {
        return [
            {
                test: cssOptions.cssRegex,
                exclude: cssOptions.cssModuleRegex,
                use: [
                    opts.inlineStyle ?
                        require.resolve("style-loader") :
                        require(require.resolve("mini-css-extract-plugin")).loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: cssOptions.importLoaders,
                        },
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: postConfig(opts)
                    },
                    preProcessor && require.resolve(preProcessor),
                ].filter(Boolean)
            },
            {
                test: cssOptions.cssModuleRegex,
                use: [
                    opts.inlineStyle ?
                        require.resolve("style-loader") :
                        require(require.resolve("mini-css-extract-plugin")).loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: cssOptions.importLoaders,
                            modules: true,
                        },
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: postConfig(opts)
                    },
                    preProcessor && require.resolve(preProcessor),
                ].filter(Boolean)
            }
        ];
    }

    // if (enableModule.eslint) {
    //     const eslintFile = fs.existsSync(cfg.eslintFile) ? cfg.eslintFile : null;
    //     rules.push(
    //         {
    //             enforce: "pre",
    //             test: /\.jsx?$/,
    //             exclude: /node_modules/,
    //             loader: require.resolve("eslint-loader"),
    //             options: {
    //                 baseConfig: require('../config/eslint.config.js'),
    //                 useEslintrc: false,
    //                 configFile: eslintFile,
    //             }
    //         }
    //     );
    // }

    // Object.keys(enableModule).forEach(module => {
    //     if (enableModule[module] && loaders[module]) {
    //         oneOf.push(loaders[module](cfg));
    //     }
    // });

    // oneOf.push(...defaultLoaders(cfg));

    // rules.push({
    //     oneOf
    // });

    return {
        rules: [
            // Disable require.ensure
            { parser: { requireEnsure: false } },

            // run the linter.
            {
                enforce: 'pre',
                test: /\.(js|mjs|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        options: {
                            // formatter: require.resolve('react-dev-utils/eslintFormatter'),
                            eslintPath: require.resolve('eslint'),

                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                // include: paths.appSrc,
            },
            {
                oneOf: [
                    //static/media
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },

                    // Process JS with Babel.
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        loader: require.resolve('babel-loader'),
                        // exclude: cfg.babelOptions.exclude,
                        exclude: [/@babel(?:\/|\\{1,2})runtime/, /core\-js/],
                        use: [{
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: true,
                                compact: false,
                                presets: [
                                    [
                                        require.resolve("babel-preset-packez"),
                                        {
                                            helpers: true
                                        },
                                    ],
                                ],
                            }
                        }],
                        cacheDirectory: true,
                        // cacheCompression: isEnvProduction,
                        // compact: isEnvProduction,
                    },

                    // Process CSS.
                    ...getStyleLoaders(
                        {
                            cssRegex,
                            cssModuleRegex,
                            importLoaders: 1,
                        },
                    ),
                    ...getStyleLoaders(
                        {
                            cssRegex: sassRegex,
                            cssModuleRegex: sassModuleRegex,
                            importLoaders: 2,
                        },
                        'sass-loader'
                    ),
                    ...getStyleLoaders(
                        {
                            cssRegex: lessRegex,
                            cssModuleRegex: lessModuleRegex,
                            importLoaders: 2,
                        },
                        'less-loader'
                    ),

                    //Process json5.
                    {
                        test: /\.json5$/,
                        loader: require.resolve('json5-loader')
                    },

                    //Process Vue2.
                    {
                        test: /\.vue$/,
                        loader: require.resolve("vue-loader"),
                    },

                    //
                    {
                        loader: require.resolve('file-loader'),
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.vue$/, /\.json5?$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ]
            }
        ].filter(Boolean)
    };
}