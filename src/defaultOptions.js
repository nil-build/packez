
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

    shouldUseFetch: true,

    shouldUseEntryHTML: true,
    // {
    //     index: './src/template.html',
    //     app: './src/app.html'
    // }
    entryHTMLTemplates: {},
    entryHTMLExt: '.html',

    shouldUseSourceMap: true,

    shouldUseSplitChunks: true,

    runtimeChunk: false,

    inlineStyle: false,

    publicPath: '',

    mode: 'development', // development  production

    cnpm: false,
    //构建前清空outputDir目录
    clear: true,

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

    eslintFile: '', //自定义eslint配置文件

    IgnoreList: [
        [/^\.[\\/]locale$/, /moment$/]
    ],
    DefinePluginArgs: null,
    BannerPluginArgs: null,

    htmlLoaderOptions: {},
    rawLoaderRegexp: /\.txt$/,
    //启用模块
    modules: {
        "babel": false,
        "css": true,
        "less": false,
        "sass": false,
        "eslint": false,
        "json5": false,
        "jsx": false,
        "vue": false,
    },

    //webpack options
    target: 'web',
    devtool: "source-map",
    resolve: {},
    externals: {},
    performance: false,
};

module.exports = function parseConfig(options) {

    return merge({}, defaults, options)
}