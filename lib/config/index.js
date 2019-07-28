
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = _default;

var _lodash = require("lodash");

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _default(opts = {}) {
  opts = { ...opts
  };
  const defaultOptions = {
    mode: "development",
    // development  production
    cwd: process.cwd(),
    appSrc: [],
    //outputDir: 'dist',
    publicPath: "",
    configPath: true,
    //useTypeScript: false,
    polyfills: require.resolve("../polyfills"),
    shouldUseEntryHTML: true,
    //默认根据entry自动获取对于的.html文件
    entryHTMLTemplates: {},
    shouldUseSourceMap: true,
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
      //vue-loader
      vue: false,
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
    browserslist: ["> 0.5%", "last 2 versions", "not dead", "not ie <= 11", "not op_mini all"],
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
  }; // return defaultsDeep({}, opts, defaultOptions);

  const _opts = (0, _lodash.defaultsDeep)({}, opts, defaultOptions);

  let configFile = (0, _lodash.isString)(_opts.configPath) ? _path.default.resolve(_opts.cwd, _opts.configPath) : _path.default.resolve(_opts.cwd, "packez.config.js");
  let config = {};

  if (_opts.configPath !== false && _fsExtra.default.existsSync(configFile)) {
    config = require(configFile);

    if ((0, _lodash.isFunction)(config)) {
      config = config(_opts);
    }
  }

  (0, _lodash.defaultsDeep)(opts, config, defaultOptions);
  return opts;
}