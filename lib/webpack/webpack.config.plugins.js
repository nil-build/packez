
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

const path = require('path');

const fs = require("fs");

const webpack = require('webpack');

const _ = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//var Visualizer = require('webpack-visualizer-plugin');


module.exports = function (opts) {
  const isEnvProduction = opts.mode === 'production';
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
        filename: [opts.assest.css.output || ".", opts.assest.css.name].join('/'),
        chunkFilename: [opts.assest.css.output || ".", opts.assest.css.chunkName].join('/')
      }));
    }
  } //开启manifest模式


  if (corePlugins.manifest && isEnvProduction) {
    const ManifestPlugin = require('webpack-manifest-plugin');

    plugins.push(new ManifestPlugin({ ...corePlugins.manifest
    }));
  } //生成html页面


  if (opts.shouldUseEntryHTML) {
    const defaultHtmlOpts = {
      inject: true,
      templateParameters: {
        PUBLIC_URL: [opts.publicPath || '.'].join('/') //, path.relative(opts.outputDir,1)

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


    (0, _keys.default)(opts.entry).forEach(key => {
      var htmlOpts = (0, _assign.default)({}, defaultHtmlOpts);
      const len = opts.entry[key].length;
      const entry = opts.entry[key][len - 1];
      let template = opts.entryHTMLTemplates[key] || entry.replace(/\.(?:js|mjs|jsx|ts|tsx)$/, '.html'); // if (template) {

      template = path.resolve(opts.cwd, template);

      if (fs.existsSync(template)) {
        htmlOpts.template = template;
      } else {
        htmlOpts.template = path.resolve(__dirname, '../template_index.ejs');
      } //}


      htmlOpts.filename = key + '.html';
      htmlOpts.chunks = [key];
      plugins.push(new HtmlWebpackPlugin(htmlOpts));
    });
  }

  if (loaders.vue) {
    const VueLoaderPlugin = require('vue-loader/lib/plugin');

    plugins.push(new VueLoaderPlugin());
  }

  return plugins;
};