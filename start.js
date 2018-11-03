
const {
    getWebpackConfig,
    installDeps
} = require('./lib');
const webpack = require("webpack");
const omit = require('object.omit');
const fs = require("fs-extra");
const log = require('./lib/logger');

module.exports = function (entry, output, opts = {}) {
    opts.mode = opts.mode || 'development';
    const watch = opts.watch;

    opts = omit(opts, ['devServer', 'watch']);

    installDeps(opts);

    const webpackConfig = getWebpackConfig(entry, output, opts);

    fs.ensureDirSync(webpackConfig.output.path);

    if (opts.clear) {
        fs.emptyDirSync(webpackConfig.output.path);
    }

    const compiler = webpack(webpackConfig);

    const compilerCb = function (err, stats) {
        if (err) {
            return log(err);
        }

        log(stats.toString({
            chunks: false,
            colors: true,
        }));
    }
    if (watch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, compilerCb);
    } else {
        compiler.run(compilerCb);
    }

}