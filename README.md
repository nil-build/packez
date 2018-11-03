# packez

`npm install --save-dev packez`

## Useage

`packez src -d dist -w -c`;

## API

```
const packez = require("packez");

packez(entry, output, options);

packez.start(entry, output, options);
packez.build(entry, output, options);
packez.server(entry, output, options);

```

## Options
```
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
    DefinePluginArgs: {},
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
```

## cli

```
    .option('-w, --watch', '是否监控文件改变', true)
    .option('-d, --outDir [outDir]', '输出到指定目录，默认为 dist', 'dist')
    .option('-t, --target [target]', '转换目标格式：web | node 默认为 web', /^node|web$/, 'web')
    .option('-c, --clear', '转换前清空输出目录', true)
    .option('-p, --publicPath [publicPath]', 'publicPath', '')
    .option('--config ', '配置文件', 'webpack.config.js')
    .option('--mode [mode]', '转换模式：development（默认值）、production，production模式下minify生效', 'development')
    .option('--banner [banner]', '在每个转换文件顶部添加注释文本', '')
    .option('--strictMode [strictMode]', '参考 babel', /^true|false$/, 'true')
    .option('--cnpm', '使用cnpm安装依赖', true)
    .option('--corejs [corejs]', '参考 babel-runtime', true)
    .option('--helpers [helpers]', '参考 babel-runtime', true)
    .option('--regenerator [regenerator]', '参考 babel-runtime', true)
```
