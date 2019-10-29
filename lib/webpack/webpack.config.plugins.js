
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const path = require("path");

const fs = require("fs");

const webpack = require("webpack");

const _ = require("lodash");

const HtmlWebpackPlugin = require("html-webpack-plugin"); //
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//var Visualizer = require('webpack-visualizer-plugin');


module.exports = function (opts) {
  const isEnvProduction = opts.mode === "production";
  const loaders = opts.loaders;
  const corePlugins = opts.plugins;
  const plugins = [...opts.pluginExtra, // new Visualizer({
  //     filename: './statistics.html'
  // }),
  //new BundleAnalyzerPlugin(),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  })].filter(Boolean); //打包合并css成文件

  if (!opts.inlineStyle) {
    if (loaders.css || loaders.less || loaders.sass || loaders.scss) {
      const MiniCssExtractPlugin = require("mini-css-extract-plugin");

      plugins.push(new MiniCssExtractPlugin({
        filename: [opts.assest.css.output || ".", opts.assest.css.name].join("/"),
        chunkFilename: [opts.assest.css.output || ".", opts.assest.css.chunkName].join("/")
      }));
    }
  } //开启manifest模式


  if (corePlugins.manifest && isEnvProduction) {
    const ManifestPlugin = require("webpack-manifest-plugin");

    plugins.push(new ManifestPlugin(_objectSpread({}, corePlugins.manifest)));
  } //生成html页面


  if (opts.shouldUseEntryHTML) {
    const defaultHtmlOpts = {
      inject: true,
      templateParameters: {
        PUBLIC_URL: [opts.publicPath || "."].join("/") //, path.relative(opts.outputDir,1)

      }
    };

    if (isEnvProduction) {
      defaultHtmlOpts.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      };
    } // 示例
    // entry: {
    //     app1: './src/index.js',
    //     app2: './src/app.js',
    // }
    // 如果不指定html模板则默认寻找 ./src/index.html 和 ./src/app.html 文件


    Object.keys(opts.entry).forEach(key => {
      var htmlOpts = Object.assign({}, defaultHtmlOpts);
      const len = opts.entry[key].length;
      const entry = opts.entry[key][len - 1];
      let template = opts.entryHTMLTemplates[key] || entry.replace(/\.(?:js|mjs|jsx|ts|tsx)$/, ".html"); // if (template) {

      template = path.resolve(opts.cwd, template);

      if (fs.existsSync(template)) {
        htmlOpts.template = template;
      } else {
        htmlOpts.template = path.resolve(__dirname, "../template_index.ejs");
      } //}


      htmlOpts.filename = key + ".html";
      htmlOpts.chunks = [key];
      plugins.push(new HtmlWebpackPlugin(htmlOpts));
    });
  }

  return plugins;
};