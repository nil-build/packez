
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _default(opts = {}) {
  opts = _objectSpread({}, opts);
  const defaultOptions = {
    cwd: process.cwd(),
    mode: "development",
    // development  production
    appSrc: [],
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
    cnpm: false,
    clear: true,
    //内置加载器
    loaders: {
      //eslint-loader
      eslint: true,
      //raw-loader
      raw: {
        test: /\.txt$/
      },
      //babel-loader
      babel: true,
      //css-loader
      css: true,
      //less-loader
      less: false,
      //sass-loader
      scss: false,
      //sass-loader
      sass: false,
      //json5-loader
      json5: true,
      //html-loader
      html: true
    },
    //扩展加载器
    loaderExtra: [],
    //预处理加载器
    preLoaderExtra: [],
    //内置插件
    plugins: {
      manifest: true
    },
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
    browserslist: [">= .25%", "not dead", "not op_mini all", "not Android 4.4.3-4.4.4", "not ios_saf < 10", // "not ie <= 11",
    "not Chrome < 50", // caniuse lastest is reporting chrome 29
    "firefox ESR"],
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

  const _opts = (0, _lodash.defaultsDeep)({}, opts, defaultOptions);

  let configFile = (0, _lodash.isString)(_opts.configFile) ? _path.default.resolve(_opts.cwd, _opts.configFile) : _opts.configFile;
  let config = {};

  if (configFile !== false && _fsExtra.default.existsSync(configFile)) {
    config = require(configFile);

    if ((0, _lodash.isFunction)(config)) {
      config = config(_opts);
    }
  }

  return (0, _lodash.defaultsDeep)(config, opts, defaultOptions);
}