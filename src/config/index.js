import { defaultsDeep, isFunction, isString } from 'lodash';
import path from 'path';
import fs from 'fs-extra';
//packez.config.js

export default function (opts = {}) {
    opts = { ...opts };

    const defaultOptions = {
        mode: 'development', // development  production
        cwd: process.cwd(),
        // entry: {
        //     index: './src/index.js'
        // },
        outputDir: 'dist',
        publicPath: '',

        configPath: true,

        //useTypeScript: false,

        //启用默认的 polyfills库 Map Set Promise
        //whatwg-fetch?
        //raf?
        // polyfills: require.resolve('./polyfills.js'),

        // shouldUseFetch: true,
        shouldUseEntryHTML: true,
        //默认根据entry自动获取对于的.html文件
        entryHTMLTemplates: {},
        //entryHTMLExt: '.html',

        shouldUseSourceMap: true,

        //shouldUseSplitChunks: true,

        runtimeChunk: false,

        inlineStyle: false,

        cnpm: false,
        //构建前清空outputDir目录
        clear: true,

        //内置加载器
        loaders: {
            //eslint-loader
            "eslint": true,
            //raw-loader
            "raw": {
                test: /\.txt$/,
            },
            //babel-loader
            "babel": true,
            //css-loader
            "css": true,
            //less-loader
            "less": true,
            //sass-loader
            "scss": true,
            //sass-loader
            "sass": true,
            //json5-loader
            "json5": true,
            //vue-loader
            "vue": false,
            //html-loader
            "html": true,
        },
        //扩展加载器
        loaderExtra: [],
        //预处理加载器
        preLoaderExtra: [],
        //内置插件
        plugins: {
            "manifest": true,
            // "analyzer": false,// webpack-bundle-analyzer
        },
        //扩展插件
        pluginExtra: [],

        assest: {
            css: {
                name: "[name].[contenthash:8].css",
                chunkName: "[name].[chunkhash:8].chunk.css",
                output: "static/css",
            },
            js: {
                name: "[name].[chunkhash:8].js",
                chunkName: "[name].[chunkhash:8].chunk.js",
                output: "static/js"
            },
            media: {
                regexp: /\.(?:png|jpe?g|gif|bmp)$/,
                name: "[name].[hash:8].[ext]",
                output: "static/media",
                limit: 10000,
            }
        },

        //webpack options
        optimization: {},
        target: 'web',
        //devtool: "source-map",
        resolve: {},
        externals: {},
        performance: false,
    };

    const _opts = defaultsDeep({}, opts, defaultOptions);

    let configFile = isString(_opts.configPath) ?
        path.join(_opts.cwd, _opts.configPath) :
        path.join(_opts.cwd, 'packez.config.js');
    let config = {};


    if (_opts.configPath !== false && fs.existsSync(configFile)) {
        config = require(configFile);
        if (isFunction(config)) {
            config = config(opts.mode, _opts);
        }
    }

    defaultsDeep(opts, config, defaultOptions);

    return opts;
}