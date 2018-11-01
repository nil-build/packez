const path = require('path');
const webpackModule = require('./webpack.config.module');
const webpackPlugins = require('./webpack.config.plugins');
const webpackOptimization = require('./webpack.config.optimization');
const merge = require('../merge');

module.exports = function (cfg) {
    const assestJs = cfg.assest.js;
    const options = {
        context: cfg.cwd,
        mode: cfg.mode,
        devtool: cfg.devtool, //测试环境用eval 提高编译速度 //"source-map",
        entry: cfg.entry,
        output: merge({
            path: cfg.appOutputDir,
            filename: path.join(assestJs.output, assestJs.name),
            chunkFilename: path.join(assestJs.output, assestJs.chunkName),
            publicPath: cfg.publicUrl,
        }, cfg.output || {}),
        module: webpackModule(cfg),
        plugins: webpackPlugins(cfg),
        optimization: webpackOptimization(cfg),
        externals: cfg.externals,
        resolve: cfg.resolve,
        performance: cfg.performance,
        target: cfg.target,
    };

    return options;
}