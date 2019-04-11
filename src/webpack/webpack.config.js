const path = require('path');
const getWebpackModule = require('./webpack.config.module');
const getWebpackPlugins = require('./webpack.config.plugins');
const getWebpackOptimization = require('./webpack.config.optimization');
const merge = require('../merge');

module.exports = function (opts) {
    const assestJs = opts.assest.js;
    const isEnvProduction = opts.mode === 'production';
    const isEnvDevelopment = opts.mode === 'development';
    const options = {
        context: opts.cwd,
        mode: opts.mode,
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? opts.shouldUseSourceMap
                ? 'source-map'
                : false
            : isEnvDevelopment && 'cheap-module-source-map',
        entry: opts.entry,
        output: {
            path: path.resolve(opts.outputDir),
            filename: [assestJs.output || ".", assestJs.name].join('/'),
            chunkFilename: [assestJs.output || ".", assestJs.chunkName].join('/'),
            publicPath: opts.publicPath,
        },
        module: getWebpackModule(opts),
        plugins: getWebpackPlugins(opts),
        optimization: getWebpackOptimization(opts),
        externals: opts.externals,
        resolve: opts.resolve,
        performance: opts.performance,
        target: opts.target,
    };

    if (opts.node) {
        options.node = opts.node;
    }

    return options;
}