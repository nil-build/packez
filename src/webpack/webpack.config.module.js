const path = require('path');
const fs = require("fs");
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
                            loaders: true,
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
        //html文件加载
        loaders.html && {
            test: /\.html?$/,
            loader: require.resolve("html-loader"),
            options: {
                ...loaders.html
            }
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
        // js文件处理
        loaders.babel && {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            exclude: [/@babel(?:\/|\\{1,2})runtime/, /core\-js/],
            options: {
                babelrc: false,
                configFile: true,
                compact: false,
                presets: [
                    [
                        require.resolve("babel-preset-packez"),
                        {
                            useBuiltIns: false,
                            modules: "commonjs",
                            runtimeOptions: {
                                corejs: 2,
                                helpers: true,
                                regenerator: true,
                            },
                        }
                        // _.defaultsDeep(
                        //     {},
                        //     _.isObject(loaders.babel) ? loaders.babel : {},
                        //     {
                        //         runtimeOptions: {
                        //             corejs: 2,
                        //             helpers: true,
                        //             regenerator: true,
                        //         },
                        //         modules: "commonjs",
                        //         strictMode: true,
                        //         // exclude: [
                        //         //     /(node_modules|bower_components)/m,
                        //         // ]

                        //     }
                        // ),
                    ],
                ],
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
            },
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
            // exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.vue$/, /\.json5?$/],
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