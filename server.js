
const webpackDevServer = require('webpack-dev-server');
const opn = require("opn");
const packez = require('./lib');
const webpack = require("webpack");
const omit = require('object.omit');
const log = require('./lib/logger');

const options = {
    host: '127.0.0.1',
    clientLogLevel: 'none',
    hot: true,
    overlay: false,
    compress: true,
    port: 9000,
};

module.exports = function (entry, output, opts = {}) {

    const devServer = opts.devServer || {};

    opts = omit(opts, ['devServer', 'watch']);

    const webpackConfig = packez(entry, output, opts);

    const compiler = webpack(webpackConfig);

    const devServerOptions = Object.assign({}, options, devServer, {
        contentBase: webpackConfig.output.path,
    });

    const server = new webpackDevServer(compiler, devServerOptions);

    server.listen(devServerOptions.port, devServerOptions.host, () => {
        log('Starting server on http://%s:%d', devServerOptions.host, devServerOptions.port);
        opn(`http://${devServerOptions.host}:${devServerOptions.port}`);
    });

}