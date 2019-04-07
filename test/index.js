
const {
    getWebpackConfig,
    installDeps,
    normalizeConfig
} = require('../lib');
const webpack = require("webpack");
const omit = require('object.omit');
const fs = require("fs-extra");
const log = require('../lib/logger');


console.log(require.resolve('./src/index.js'));

const dist = __dirname + '/dist';

const webpackConfig = getWebpackConfig(
    [require.resolve('./src/boot.js'),
    require.resolve('./src/index.js')],
    dist,
    ({
        runtimeChunk: true,
        //   publicPath: "../abc"
    })
);

fs.ensureDirSync(dist);


fs.emptyDirSync(dist);

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
if (1) {
    compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, compilerCb);
} else {
    compiler.run(compilerCb);
}

