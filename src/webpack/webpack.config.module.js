import _ from 'lodash';
const postConfig = require('../config/postcss.config');

module.exports = function (opts) {
    let oneOf = [];
    const isEnvProduction = opts.mode === 'production';
    const mediaPublicPath = _.get(opts, 'assest.media.publicPath', opts.publicPath);
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

    const getStyleLoaders = function (cssOptions, preProcessor) {
        const publicPath = _.get(opts, 'assest.css.publicPath', opts.publicPath);

        return [
            {
                test: cssOptions.cssRegex,
                exclude: cssOptions.cssModuleRegex,
                use: [
                    opts.inlineStyle ?
                        require.resolve("style-loader") :
                        {
                            loader: require(require.resolve("mini-css-extract-plugin")).loader,
                            options: {
                                publicPath,
                            }
                        },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: cssOptions.importLoaders,
                            sourceMap: isEnvProduction && opts.shouldUseSourceMap,
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
                        {
                            loader: require(require.resolve("mini-css-extract-plugin")).loader,
                            options: {
                                publicPath,
                            }
                        },
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: cssOptions.importLoaders,
                            modules: true,
                            sourceMap: isEnvProduction && opts.shouldUseSourceMap,
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

    oneOf = [
        //扩展模块
        ...loaderExtra,
        //自定义匹配规则
        loaders.raw && {
            test: _.get(loaders, 'raw.test') || /\.txt$/,
            loader: require.resolve("raw-loader"),
        },

        {
            test: /\.ejs?$/,
            loader: require.resolve("ejs-loader")
        },

        //html文件加载
        loaders.html && {
            test: /\.html?$/,
            loader: require.resolve("html-loader"),
            options: {
                ...loaders.html
            }
        },
        // js文件处理
        loaders.babel && {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            exclude: /node_modules/,
            options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                    [
                        require.resolve("babel-preset-packez"),
                        _.defaultsDeep(
                            {},
                            _.isObject(loaders.babel) ? loaders.babel : {},
                            {
                                runtimeOptions: {
                                    corejs: 2,
                                    helpers: true,
                                    regenerator: true,
                                },
                                modules: "commonjs",
                                strictMode: true,
                            }
                        ),
                    ],
                ],
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
            },
        },

        //资源文件如图片
        assestMedia.regexp && {
            test: assestMedia.regexp,
            use: [{
                loader: require.resolve('url-loader'),
                options: {
                    limit: assestMedia.limit,
                    name: assestMedia.name,
                    outputPath: assestMedia.output,
                    publicPath: mediaPublicPath,
                }
            }]
        },

        //处理json5
        loaders.json5 && {
            test: /\.json5$/,
            loader: require.resolve('json5-loader')
        },

        //处理vue格式文件
        loaders.vue && {
            test: /\.vue$/,
            loader: require.resolve("vue-loader"),
        },

    ].filter(Boolean);

    if (loaders.css) {
        oneOf.push(
            ...getStyleLoaders(
                {
                    cssRegex,
                    cssModuleRegex,
                    importLoaders: 1,
                },
            )
        );
    }

    if (loaders.scss || loaders.sass) {
        oneOf.push(
            ...getStyleLoaders(
                {
                    cssRegex: sassRegex,
                    cssModuleRegex: sassModuleRegex,
                    importLoaders: 2,
                },
                'sass-loader'
            )
        );
    }

    if (loaders.less) {
        oneOf.push(
            ...getStyleLoaders(
                {
                    cssRegex: lessRegex,
                    cssModuleRegex: lessModuleRegex,
                    importLoaders: 2,
                },
                'less-loader'
            )
        );
    }
    // 使用file-loader处理其他文件
    oneOf.push(
        {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.ejs$/, /\.json$/],
            options: {
                name: assestMedia.name,
                outputPath: assestMedia.output,
                publicPath: mediaPublicPath,
            },
        }
    );

    return {
        rules: [
            // Disable require.ensure
            { parser: { requireEnsure: false } },

            ...preLoaderExtra.map(loader => {
                return {
                    ...loader,
                    enforce: 'pre',
                }
            }),

            // run the linter.
            loaders.eslint && {
                enforce: 'pre',
                test: /\.(js|mjs|jsx)$/,
                exclude: /node_modules/,
                loader: require.resolve('eslint-loader'),
                options: {
                    ...loaders.eslint,
                    baseConfig: require('../config/eslint.config.js'),
                    eslintPath: require.resolve('eslint'),
                },
            },
            {
                oneOf
            }
        ].filter(Boolean)
    };
}