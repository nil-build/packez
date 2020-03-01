"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _webpack = _interopRequireDefault(require("webpack"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _webpackManifestPlugin = _interopRequireDefault(require("webpack-manifest-plugin"));

var _forkTsCheckerWebpackPlugin = _interopRequireDefault(require("fork-ts-checker-webpack-plugin"));

var _getTSConfig = require("../config/getTSConfig");

const typescriptFormatter = require("../utils/typescriptFormatter"); //
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//var Visualizer = require('webpack-visualizer-plugin');


function _default(opts) {
  const isEnvProduction = opts.mode === "production";
  const isEnvDevelopment = opts.mode === "development";
  const corePlugins = opts.plugins;
  const manifest = opts.manifest;
  const tsCheck = opts.tsCheck;
  const plugins = [...opts.pluginExtra, new _webpack.default.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  })].filter(Boolean); //打包合并css成文件

  if (!opts.inlineStyle) {
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");

    plugins.push(new MiniCssExtractPlugin({
      filename: [opts.assest.css.output || ".", opts.assest.css.name].join("/"),
      chunkFilename: [opts.assest.css.output || ".", opts.assest.css.chunkName].join("/")
    }));
  }

  if (manifest) {
    plugins.push(new _webpackManifestPlugin.default({
      fileName: "asset-manifest.json",
      publicPath: opts.publicPath
    }));
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
      let template = opts.entryHTMLTemplates[key] || entry.replace(/\.(?:js|mjs|jsx|ts|tsx)$/, ".html");
      template = _path.default.resolve(opts.cwd, template);

      if (_fsExtra.default.existsSync(template)) {
        htmlOpts.template = template;
      } else {
        htmlOpts.template = _path.default.resolve(__dirname, "../public/index.html");
      }

      htmlOpts.filename = key + ".html";
      htmlOpts.chunks = [key];
      plugins.push(new _htmlWebpackPlugin.default(htmlOpts));
    });
  }

  if (tsCheck) {
    plugins.push(new _forkTsCheckerWebpackPlugin.default({
      tsconfig: (0, _getTSConfig.getTSConfigFilePath)(opts),
      compilerOptions: (0, _getTSConfig.getTSCompilerOptions)(opts),
      async: isEnvDevelopment,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      formatter: typescriptFormatter
    }));
  }

  return plugins;
}