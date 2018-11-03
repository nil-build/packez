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
        bail: cfg.mode === 'production' ? true : false,
        devtool: cfg.shouldUseSourceMap ? cfg.devtool : 'none', //测试环境用eval 提高编译速度 //"source-map",
        entry: cfg.entry,
        output: merge(
            {
                path: cfg.outputDir,
                filename: path.join(assestJs.output, assestJs.name),
                chunkFilename: path.join(assestJs.output, assestJs.chunkName),
                publicPath: cfg.publicPath,
            },
            cfg.output || {}
        ),
        module: merge(
            {},
            webpackModule(cfg),
            cfg.module
        ),
        plugins: [...(cfg.plugins || []), ...webpackPlugins(cfg)],
        optimization: webpackOptimization(cfg),
        externals: cfg.externals,
        resolve: cfg.resolve,
        performance: cfg.performance,
        target: cfg.target,
    };

    options.output.path = path.resolve(options.output.path);

    if (cfg.node) {
        options.node = cfg.node;
    }

    return options;
}