import { defaultsDeep, isFunction, isString } from "lodash";
import path from "path";
import fs from "fs-extra";

export default function(opts = {}) {
    const defaultOptions = {
        cwd: process.cwd(),
        mode: "development", // development  production
        include: null,
        exclude: null,
        //outputDir: 'dist',
        publicPath: "",

        configFile: "./packez.config.js",

        //useTypeScript: false,

        polyfills: require.resolve("../polyfills"),

        shouldUseEntryHTML: true,
        //默认根据entry自动获取对于的.html文件
        entryHTMLTemplates: {},

        shouldUseSourceMap: false,

        inlineStyle: false,

        clear: true,

        tsCompilerOptions: {},

        babel: {},

        eslint: {},

        //扩展加载器
        loaderExtra: [],
        //预处理加载器
        preLoaderExtra: [],

        //扩展插件
        pluginExtra: [],

        assest: {
            css: {
                name: "[name].[contenthash:8].css",
                chunkName: "[name].[chunkhash:8].chunk.css",
                output: "static/css"
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
                limit: 10000
            }
        },
        //打包时如果检查到package.json未设置browserslist时则将该配置写到package.json中
        //后续如果需要修改browserslist则直接修改package.json文件
        browserslist: [
            ">=0.2%",
            "not dead",
            "not op_mini all",
            "not Android 4.4.3-4.4.4",
            "not ios_saf < 10",
            // "not ie <= 11",
            "not Chrome < 50", // caniuse lastest is reporting chrome 29
            "firefox ESR"
        ],

        //webpack options
        optimization: {},
        target: "web",
        resolve: {},
        externals: {},
        performance: false,

        //watch
        watch: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: undefined
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
            publicPath: "/"
        },
        node: {
            module: "empty",
            dgram: "empty",
            dns: "mock",
            fs: "empty",
            net: "empty",
            tls: "empty",
            child_process: "empty"
        }
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
        }
    }

    return defaultsDeep(config, _opts);
}
