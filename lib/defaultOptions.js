
"use strict";

const {
  resolveCwd
} = require("./utils");

const merge = require("./merge");

const defaults = {
  mode: 'development',
  // development  production
  appPath: resolveCwd("."),
  appSrc: "src",
  // path.resolve( appPath, appSrc )
  appDist: "dist",
  // path.resolve( appPath, appDist )
  publicUrl: "",
  devtool: "source-map",
  appPolyfills: require.resolve("./polyfills.js"),
  appEntryJs: "index.js",
  // path.resolve( appPath, appSrc, appEntryJs )
  appEntryHtml: "index.html",
  // path.resolve( appPath, appSrc, appEntryHtml )
  appEntryHtmlOpts: {},
  cleanDist: false,
  splitChunks: true,
  cnpm: false,
  resolve: {},
  externals: {},
  performance: {},
  target: 'web',
  assest: {
    css: {
      name: "[name].[contenthash:8].css",
      output: "static/css"
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
      limit: 8192
    }
  },
  manifest: {
    enableMode: 'production'
  },
  babelOptions: {
    corejs: true,
    helpers: true,
    regenerator: true,
    modules: "commonjs",
    strictMode: true,
    exclude: [/(node_modules|bower_components)/m]
  },
  babelConfig: {},
  //自定义babel配置，不建议使用
  eslintFile: '',
  //自定义eslint配置文件
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
    "babel": true,
    "css": true,
    "less": false,
    "sass": true,
    "eslint": false,
    "json5": true,
    "jsx": true,
    "vue": false
  },
  watch: false,
  // watchOptions: {},
  devServer: {}
};

module.exports = function parseConfig(options) {
  return merge({}, defaults, options);
};