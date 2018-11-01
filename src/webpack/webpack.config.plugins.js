const path = require('path');
const fs = require("fs");
const webpack = require('webpack');
const chalk = require('chalk');
const warning = chalk.keyword('orange');

module.exports = function (cfg) {

    const plugins = [
        new webpack.IgnorePlugin(...(cfg.ignore || cfg.IgnorePlugin)),
        new webpack.DefinePlugin(cfg.defines || cfg.DefinePlugin)
    ];

    if (cfg.banner || cfg.BannerPlugin) {
        plugins.push(
            new webpack.BannerPlugin(cfg.banner || cfg.BannerPlugin)
        );
    }

    //开启manifest模式
    if (cfg.manifest.enableMode === cfg.mode) {
        const ManifestPlugin = require('webpack-manifest-plugin');
        plugins.push(new ManifestPlugin());
    }
    //打包前清理文件夹
    if (cfg.cleanDist) {
        const CleanWebpackPlugin = require('clean-webpack-plugin');
        plugins.push(
            new CleanWebpackPlugin(path.basename(cfg.appDist), {
                root: cfg.appPath
            })
        );
    }
    //打包合并css成文件
    if (!cfg.inlineStyle) {
        if (cfg.module.css || cfg.module.less || cfg.module.sass) {
            const MiniCssExtractPlugin = require("mini-css-extract-plugin");
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: cfg.assest.css.output + '/' + cfg.assest.css.name
                })
            );
        }
    }

    //生成首页html
    // if (cfg.appEntryHtml) {
    //     const appEntryHtml = path.resolve(cfg.appPath, cfg.appSrc, cfg.appEntryHtml);
    //     const htmlOpts = {
    //         inject: true,
    //     };

    //     if (fs.existsSync(appEntryHtml)) {
    //         htmlOpts.template = appEntryHtml;
    //     } else {
    //         console.log(warning(`Warning: ${appEntryHtml} not exists!`));
    //     }

    //     if (cfg.mode === 'production') {
    //         htmlOpts.minify = {
    //             removeComments: true,
    //             collapseWhitespace: true,
    //             removeRedundantAttributes: true,
    //             useShortDoctype: true,
    //             removeEmptyAttributes: true,
    //             removeStyleLinkTypeAttributes: true,
    //             keepClosingSlash: true,
    //             minifyJS: true,
    //             minifyCSS: true,
    //             minifyURLs: true,
    //         }
    //     }

    //     plugins.push(
    //         new HtmlWebpackPlugin(Object.assign({}, cfg.appEntryHtmlOpts, htmlOpts))
    //     );
    // }
    if (cfg.shouldUseEntryHTML) {
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        const defaultHtmlOpts = {
            inject: true,
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
                minifyURLs: true,
            }
        }

        Object.keys(cfg.entry).forEach(key => {
            var htmlOpts = Object.assign({}, defaultHtmlOpts);
            let template = cfg.entryHTMLTemplates[key];
            if (template) {
                template = path.resolve(cfg.cwd, template);
                if (fs.existsSync(template)) {
                    htmlOpts.template = template;
                }
            }
            htmlOpts.filename = key + cfg.entryHTMLExt;
            htmlOpts.chunks = [key];

            plugins.push(
                new HtmlWebpackPlugin(htmlOpts)
            );
        });
    }

    if (cfg.module.vue) {
        const VueLoaderPlugin = require('vue-loader/lib/plugin');
        plugins.push(
            new VueLoaderPlugin()
        );
    }

    return plugins;
}
