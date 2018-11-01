const { resolveCwd } = require('./utils');
const merge = require("./merge");

const defaults = {
    cwd: process.cwd(),
    entry: {
        index: './src/index.js'
    },
    outputDir: 'dist',
    //启用默认的 polyfills库 Map Set Promise
    //whatwg-fetch?
    //raf?
    polyfills: require.resolve('./polyfills.js'),

    shouldUseEntryHTML: true,
    entryHTMLTemplates: {},
    entryHTMLExt: '.html',

    shouldUseSourceMap: true,//?

    shouldUseSplitChunks: true,

    runtimeChunk: false,

    inlineStyle: false,

    publicPath: '',

    mode: 'development', // development  production
    appPath: resolveCwd("."),
    appSrc: "src", // path.resolve( appPath, appSrc )
    appDist: "dist", // path.resolve( appPath, appDist )
    publicUrl: "",
    appPolyfills: require.resolve('./polyfills.js'),
    appEntryJs: "index.js", // path.resolve( appPath, appSrc, appEntryJs )
    appEntryHtml: "index.html", // path.resolve( appPath, appSrc, appEntryHtml )
    appEntryHtmlOpts: {},
    cleanDist: false,
    splitChunks: true,
    cnpm: false,

    assest: {
        css: {
            name: "[name].[contenthash:8].css",
            output: "static/css",
        },
        js: {
            name: "[name].[chunkhash:8].js",
            chunkName: "[name].[chunkhash:8].chunk.js",
            output: "static/js"
        },
        media: {
            name: "[name].[hash:8].[ext]",
            regexp: /\.(?:png|jpe?g|gif|bmp)$/,
            output: "static/media",
            limit: 8192,
        }
    },
    manifest: {
        enableMode: 'production',
    },
    babelOptions: {
        corejs: true,
        helpers: true,
        regenerator: true,
        modules: "commonjs",
        strictMode: true,
        exclude: [
            /(node_modules|bower_components)/m,
        ]
    },
    // babelConfig: {},//自定义babel配置，不建议使用
    eslintFile: '', //自定义eslint配置文件

    defines: null,
    banner: null,
    ignore: [/^\.[\\/]locale$/, /moment$/],

    IgnorePlugin: [/^\.[\\/]locale$/, /moment$/],
    DefinePlugin: {},
    BannerPlugin: null,
    htmlLoaderOptions: {},
    rawLoaderRegexp: /\.txt$/,
    //启用模块
    module: {
        "babel": false,
        "css": true,
        "less": false,
        "sass": false,
        "eslint": false,
        "json5": false,
        "jsx": false,
        "vue": false,
    },
    // watch: false,
    // // watchOptions: {},
    // devServer: {},

    //webpack options
    target: 'web',
    devtool: "source-map",
    resolve: {},
    externals: {},
    performance: {},
};

module.exports = function parseConfig(options) {

    return merge({}, defaults, options)
}