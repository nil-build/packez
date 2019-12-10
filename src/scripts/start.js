import _ from "lodash";
import fs from "fs-extra";
import initConfig from "../initConfig";
import checkDeps from "../checkDeps";
import getWebpackConfig from "../webpack/webpack.config";
import run from "../utils/webpackRun";

export default function(entry, output, opts = {}) {
    if (opts.mode !== "production") {
        opts = _.defaultsDeep({}, opts, {
            assest: {
                css: {
                    name: "[name].css",
                    chunkName: "[name].chunk.css"
                },
                js: {
                    name: "[name].js",
                    chunkName: "[name].chunk.js"
                },
                media: {
                    name: "[name].[ext]"
                }
            },
            watch: true
        });
    }

    const config = initConfig(entry, output, opts);

    checkDeps(config);

    let webpackConfig = getWebpackConfig(config);

    //自定义
    if (_.isFunction(config.getWebpackConfig)) {
        webpackConfig = config.getWebpackConfig(webpackConfig);
    }

    fs.ensureDirSync(webpackConfig.output.path);

    if (config.clean) {
        fs.emptyDirSync(webpackConfig.output.path);
    }

    const watch = config.watch;
    const watchOptions = config.watchOptions;

    run(
        Object.assign(webpackConfig, {
            watch,
            watchOptions
        })
    );
}
