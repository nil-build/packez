# packez

`npm install --save-dev packez`

## Useage

`packez src -d dist -w -c`;

## API

```
const packez = require("packez");

packez(entry, output, options);//packez.start

packez.start(entry, output, options);
packez.build(entry, output, options);
packez.server(entry, output, options);
packez.analyzer(entry, output, options);

```

## entry

`array` | `string` | `object` default: `./src/index.js`

eg: 
```
//string
packez.start('./src/app.js')

//array
packez.start(['./src/polyfills.js','./src/app.js'])

//object
packez.start({
    index: './src/index.js',
    app: ['./src/polyfills.js','./src/app.js']
})
```

## output

`string` default: `dist`


## options

### `cwd`
`string` 默认：`process.cwd()`

当前工作路径

### `mode`
`string` 

作用同`webpack.mode` 

`start()` `server()` 调用默认为 `development`

`build()` `analyzer()` 调用默认为 `production`

### `publicPath`
`string` 

作用同`webpack.publicPath`

### `configPath`
`string` or `boolean` 默认： `false`

是否开启`packez.config.js`

### `clear`
`boolean` 默认：`true`

启动打包时是否清空输出目录。

### `cnpm`
`boolean` 默认：`false`

是否使用`cnpm`来安装依赖。

### `inlineStyle`
`boolean` 默认：false

开启后使用`style-loader` 否则使用 `mini-css-extract-plugin`。前提是需要先开启`loaders.css: true`

### `shouldUseSourceMap`
`boolean` 默认：`true`

是否生成sourcemap文件，该参数只对`mode=production`有效

### `shouldUseEntryHTML`
`boolean` 默认：`true`

是否开启`HtmlWebpackPlugin`生成html页面

### `entryHTMLTemplates`
`object` 

开启`shouldUseEntryHTML`后会根据`entry`中的`key`在`entryHTMLTemplates`中查找。

e.g. 
```
packez.start({
    index: './src/app1.js',
    app: ['./src/polyfills.js','./src/app2.js']
}, 'dist', {
    entryHTMLTemplates: {
        index: './src/app.html',
        app: './src/app.html',
    }
});

```

`注`：如果未设置`entryHTMLTemplates`时则会替换entry的后缀为`.html`并寻找。

e.g. `./src/app1.js` 实际会查找 `./src/app1.html` 如果查找失败则使用默认模版。

### `polyfills`
`object` 默认：
```
{
    Promise: true,
    Set: false,
    Map: false,
    raf: false,
    fetch: false,
}
```

内置的polyfills，可以通过`entry`为数组的方式来扩展自己的`polyfills`

### `assest`
`object` 默认：
```
{
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
}
```

设置输出文件的路径就文件名规则，`注`:在`start` `server`下 `name`和`chunkName`默认不会设置`chunkhash:8`

### `loaders`
`object` 默认：
```
{
    "eslint": true,
    "raw": {
        test: /\.txt$/,
    },
    "babel": true,
    "css": true,
    "less": false,
    "scss": false,
    "sass": false,
    "json5": true,
    "vue": false,
    "html": true,
}
```
内置webpack加载器 

如果传对象则会传递给加载器
e.g. 
```
{
    eslit:{
        globals: {
            $: true,
        },
        rules: {
            "no-undef": "off"
        }
    }
}
```

### `loaderExtra`
`array`

自定义webpack加载器

### `pluginExtra`
`array`

自定义webpack插件

### `browserslist`
`array` 默认：
```
[
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
]
```

首次运行时会将此默认值设置在`package.json`，后续必须在`package.json`中设置

### `optimization`

参考`webpack.optimization`

默认: 
```
{
    runtimeChunk: true,
    splitChunks: {
        chunks: 'all',
        name: false,
    }
}
```

### `target`

参考`webpack.target`

默认：`web`

### `resolve`

参考`webpack.resolve`

### `externals`

参考`webpack.externals`

### `performance`

参考`webpack.performance`

默认：`false`

### `watch`
`boolean` 

只有调用`start()`时有效，默认：`true`

### `watchOptions`
`object` 默认：
```
{
    aggregateTimeout: 300,
    poll: undefined
}
```

详细参考 `webpack.watchOptions`

### `devServer`
`object`

只有调用`server()`时有效，默认：
```
{
    host: '0.0.0.0',
    clientLogLevel: 'none',
    quiet: true,
    watchContentBase: true,
    hot: false,
    overlay: false,
    compress: true,
    port: 9000,
    publicPath: '/'
}
```

参考`webpack.devServer`

`目前不支持HMR，hot不要开启`



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
