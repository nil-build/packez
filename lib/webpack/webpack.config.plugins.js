
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

const path = require('path');

const fs = require("fs");

const webpack = require('webpack');

const chalk = require('chalk');

const warning = chalk.keyword('orange');

module.exports = function (cfg) {
  const plugins = [new webpack.DefinePlugin(cfg.DefinePluginArgs)];
  plugins.push(...cfg.IgnoreList.map(ignore => {
    return new webpack.IgnorePlugin(...ignore);
  }));

  if (cfg.BannerPluginArgs) {
    plugins.push(new webpack.BannerPlugin(cfg.BannerPluginArgs));
  } //开启manifest模式


  if (cfg.manifest.enableMode === cfg.mode) {
    const ManifestPlugin = require('webpack-manifest-plugin');

    plugins.push(new ManifestPlugin());
  } //打包前清理文件夹
  // if (cfg.cleanDist) {
  //     const CleanWebpackPlugin = require('clean-webpack-plugin');
  //     plugins.push(
  //         new CleanWebpackPlugin(path.basename(cfg.appDist), {
  //             root: cfg.appPath
  //         })
  //     );
  // }
  //打包合并css成文件


  if (!cfg.inlineStyle) {
    if (cfg.module.css || cfg.module.less || cfg.module.sass || cfg.module.scss) {
      const MiniCssExtractPlugin = require("mini-css-extract-plugin");

      plugins.push(new MiniCssExtractPlugin({
        filename: path.join(cfg.assest.css.output, cfg.assest.css.name)
      }));
    }
  } //生成html页面


  if (cfg.shouldUseEntryHTML) {
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const defaultHtmlOpts = {
      inject: true
    };

    if (cfg.mode === 'production') {
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
    }

    (0, _keys.default)(cfg.entry).forEach(key => {
      var htmlOpts = (0, _assign.default)({}, defaultHtmlOpts);
      let template = cfg.entryHTMLTemplates[key];

      if (template) {
        template = path.resolve(cfg.cwd, template);

        if (fs.existsSync(template)) {
          htmlOpts.template = template;
        }
      }

      htmlOpts.filename = key + cfg.entryHTMLExt;
      htmlOpts.chunks = [key];
      plugins.push(new HtmlWebpackPlugin(htmlOpts));
    });
  }

  if (cfg.module.vue) {
    const VueLoaderPlugin = require('vue-loader/lib/plugin');

    plugins.push(new VueLoaderPlugin());
  }

  return plugins;
};