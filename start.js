
const packez = require('./lib');
const webpack = require("webpack");
const omit = require('object.omit');
const log = require('./lib/logger');

module.exports = function (entry, output, opts = {}) {
    opts.mode = opts.mode || 'development';
    const watch = opts.watch;

    opts = omit(opts, ['devServer', 'watch']);

    const webpackConfig = packez(entry, output, opts);

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