# packez

`npm install --save-dev packez`

## Useage

cli

npx `packez start ./src/index.js -d dist -w -c`

npx `packez server ./src/index.js -d dist -w -c`;

npx `packez build ./src/index.js -d dist -w -c`;

npx `packez analyzer ./src/index.js -d dist -w -c`;

npx `packez bundle ./src/index.js -d dist -c`;

初始化 cli：

`npx packez init`

`npm start` or `npm run build`

## API

```
const packez = require("packez");

packez(entry, output, options);//packez.start

packez.start(entry, output, options);
packez.build(entry, output, options);
packez.server(entry, output, options);
packez.analyzer(entry, output, options);
packez.bundle(entry, output, options);

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

### `include`

`string` or `array`

设置项目目录，该选项不是必须，设定后 babel-loader 及 eslint 只会对 include 的文件进行处理及校验。

`注`：`node_modules`一直都会被排除

### `mode`

`string`

作用同`webpack.mode`

`start()` `server()` 调用默认为 `development`

`build()` `analyzer()` 调用默认为 `production`

### `publicPath`

`string`

作用同`webpack.publicPath`

### `configFile`

`string` or `boolean` 默认： `./packez.config.js`

### `clean`

`boolean` 默认：`true`

启动打包时是否清空输出目录。

### `useTypeScript`

自动检测`tsconfig.json`

启用 TypeScript

### `inlineStyle`

`boolean` 默认：`false`

开启后使用`style-loader` 否则使用 `mini-css-extract-plugin`。前提是需要先开启`loaders.css: true`

### `manifest`

`boolean` 默认：`true`

是否生成 manifest 文件

### `shouldUseSourceMap`

`boolean` 默认：`true`

是否生成 sourcemap 文件，该参数只对`mode=production`有效

### `shouldUseEntryHTML`

`boolean` 默认：`true`

是否开启`HtmlWebpackPlugin`生成 html 页面

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

`注`：如果未设置`entryHTMLTemplates`时则会替换 entry 的后缀为`.html`并寻找。

e.g. `./src/app1.js` 实际会查找 `./src/app1.html` 如果查找失败则使用默认模版。

### `polyfills`

`string | array` 默认加载以下 polyfills

```
import "core-js/modules/es.promise";
import "core-js/modules/es.promise.finally";

```

内置的 polyfills，可以通过`entry`为数组的方式来扩展自己的`polyfills`

### `assets`

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
    },
    raw: {
				regexp: /\.(?:svg|txt)$/,
				esModule: true,
				options: {},
		},
}
```

> 设置输出文件的路径就文件名规则，`注`:在`start` `server`下 `name`和`chunkName`默认不会设置`chunkhash:8`

### `eslint`

e.g.

```
{
    eslit:{
        rules: {
            "no-undef": "off"
        }
    }
}
```

其他

### `babel`

`object`

当为`object`时默认为：

```
{
    exclude: null,
    babelrc: false,
    configFile: false,
    compact: false,
    presets: [],
    plugins: [],
    modules: false,
}
```

runtimeOptions: [transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime)

[@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env)

### `less`

`less-loader` 的配置参数

### `sass`

`sass-loader` 的配置参数

### postcss

`Array`

### `loaders`

`array`

自定义 webpack 加载器

### `plugins`

`array`

自定义 webpack 插件

### `browserslist`

`array` 默认：

```
[
    ">=0.2%",
    "not dead",
    "not op_mini all",
    "not Android 4.4.3-4.4.4",
    "not ios_saf < 10",
    "not Chrome < 50",
    "firefox ESR"
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

`packez [start|build|server|analyzer] [file|dir] -d -w -c ...`

```
    .option('-w, --watch', '是否监控文件改变')
    .option('-d, --outDir [outDir]', '输出到指定目录，默认为 dist', 'dist')
    .option('-t, --target [target]', '转换目标格式：web | node 默认为 web', /^node|web$/, 'web')
    .option('-c, --clear', '转换前清空输出目录')
    .option('-p, --publicPath [publicPath]', 'publicPath', '')
```
